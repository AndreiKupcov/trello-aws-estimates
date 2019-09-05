'use strict';
const Trello = require("trello");
const R = require('ramda');

console.log('Initializing Trello ...')

const TRELLO_KEY = process.env.TRELLO_KEY
const TRELLO_TOKEN = process.env.TRELLO_TOKEN
const TRELLO_MEMBER = process.env.TRELLO_MEMBER

console.log(`TRELLO_KEY: ${TRELLO_KEY}`);
console.log(`TRELLO_TOKEN: ${TRELLO_TOKEN}`);
console.log(`TRELLO_MEMBER: ${TRELLO_MEMBER}`);

const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN);

const runEstimationPerList = async (fields) => {
    try {
        const {id, name} = fields;
        const cards = await trello.getCardsForList(id);
        if (!Array.isArray(cards)){
            throw new Error(cards);
        }
        let nameTitle = await nameTrim(name);

        const cardsMapped = R.map(mapFields, cards);

        const actualValuesArray = getEstimateByCardsMapped('actual', cardsMapped);
        const plannedValuesArray = getEstimateByCardsMapped('planned', cardsMapped);

        return {
            ...fields,
            nameTitle,
            sum: {
            actual: sumEstimate(actualValuesArray),
                planned: sumEstimate(plannedValuesArray)
        }
    }

    } catch (e) {
        console.error(e)
        return e
    }

}

const updateListTitle = async (fields) =>{
    try {

        const {id,nameTitle,sum} = fields;

        if (id && sum && nameTitle) {
            const {actual, planned} = sum;

            if (actual && planned){
                // console.log(`Going to update list: ${id} ${nameTitle}`);

                return await trello.renameList(id, `(${actual}/${planned}) ${nameTitle}`);

            } else {
                return await trello.renameList(id, `${nameTitle}`);


            }
        }


    } catch (e) {
        console.error(e)
        return e
    }
}

const runEstimationPerBoard = async (fields) =>{
    try {

        const boardListsFields = await getBordListFieldsByTrelloBords(fields);
        const runEstimationPerListResult = await Promise.all(R.map(runEstimationPerList, boardListsFields));

        await Promise.all(R.map(updateListTitle, runEstimationPerListResult));

        return {
            ...fields,
            results: runEstimationPerListResult
    }

    } catch (e) {
        console.error(e)
        return e
    }
}


const runEstimates = async (event, context) => {
    try {
        const boardFields = await getBordFieldsByBords(TRELLO_MEMBER);
        const result = await Promise.all(R.map(runEstimationPerBoard, boardFields));
        return {
            event: event,
            context: context,
            result: result
        }
    } catch (e) {
        console.error(e)
        return e
    }

};

//runEstimates

const getBordFieldsByBords = async (TRELLO_MEMBER)=>{
    const boards = await trello.getBoards(TRELLO_MEMBER)
    const boardFields = R.map((o) => {
        return {
            id: R.prop('id', o),
            url: R.prop('url', o),
            name: R.prop('name', o)
        }
    }, boards)


    return boardFields
}


//  function runEstimationPerList

const mapFields = (o) => {
    let name = R.prop('name', o)
    name = R.trim(name)
    const words = name.split(' ');
    // TODO need to check if this is (x/x)
    const estimate = words[0]

    if (estimate.match(/\(\d{1,3}\/\d{1,3}\)/)) {
        let estimateValues = estimate.replace('(', '')
        estimateValues = estimateValues.replace(')', '')
        const estimateValuesArray = estimateValues.split('/')

        return {
            name: name,
            estimate: estimate,
            estimateValues: estimateValuesArray,
            actual: parseInt(estimateValuesArray[0]),
            planned: parseInt(estimateValuesArray[1])
        }
    } else {
        return {
            name: name,
            estimate: null,
            estimateValues: [],
            actual: 0,
            planned: 0
        }
    }

}




const nameTrim = (name) => {
    let nameTitle = name;
    let nameMatch = name.match(/\(\d{1,3}\/\d{1,3}\)/);

    if (nameMatch){
        nameTitle = name.replace(nameMatch,'')
    }
    nameTitle = nameTitle.trim()
    return nameTitle
};

const getEstimateByCardsMapped = (nameField, cardsMapped) =>{
    return R.map((o) => R.prop(nameField, o), cardsMapped)
}
const sumEstimate = (arr) => {
    return R.sum(arr)
}

//  function runEstimationPerBoard

const getBordListFieldsByTrelloBords = async (fields) => {
    const {id} = fields;
    const boardLists = await trello.getListsOnBoard(id);
    if (!Array.isArray(boardLists)){
        throw new Error(boardLists);
    }

    const boardListsFields = R.map((o) => {
        return {
            id: R.prop('id', o),
            name: R.prop('name', o)
        }
    }, boardLists);

    return boardListsFields
};

module.exports = {
    nameTrim,
    runEstimates,
    updateListTitle,
    mapFields,
    getBordFieldsByBords,
    getBordListFieldsByTrelloBords,
    runEstimationPerBoard,
    runEstimationPerList}
;
