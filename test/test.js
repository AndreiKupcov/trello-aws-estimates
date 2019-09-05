process.env.NODE_ENV = 'test';

const assert = require('assert');
const test_helper = require('../test/test_helper')
const handler = require('../handler');
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon')

class Trello {
    constructor(Key, Token) {
        this.getBoards = sinon.stub().returns(test_helper.boards);
        this.getListsOnBoard = sinon.stub().returns(test_helper.boardLists);
        this.getCardsForList = sinon.stub().returns(test_helper.cards);
        this.renameList = sinon.stub().returns({status: 200});

    }

}

const mdl = proxyquire('../handler.js', {
    'trello': Trello
});


describe('Test', () => {

    describe('runEstimationPerList', () => {

        it('runEstimationPerList', async () => {
            const profile = await mdl.runEstimationPerList({id: '--test--', name: '(16/16) Test'});
            assert.deepEqual(profile, test_helper.cardsExpectedTest)
        })

        let array = test_helper.getTestArray();
        array.forEach(index => {
            let elem = index.split('===');
            it('nameTrim', () => {
                assert.equal(handler.nameTrim(elem[0]), elem[1]);
            })
        });

        let getAttrCards = test_helper.getAttrCards();
        getAttrCards.forEach(el => {
            it('mapFields', () => {
                assert.deepEqual(handler.mapFields(el.actual), el.expected);
            })
        });
    });
    describe('runEstimation', () => {

        it("getBordFieldsByBords", async () => {
            const profile = await mdl.getBordFieldsByBords();
            assert.deepEqual(profile, test_helper.boardsExpectedList)


        })
    })

    describe('runEstimationPerBoard', () => {
        it("getBordListFieldsByTrelloBords", async () => {
            const profile = await mdl.getBordListFieldsByTrelloBords({id: 'test', name: 'test'});
            assert.deepEqual(profile, test_helper.listsExpectedBoard)


        })
    })

    describe('updateListTitle', () => {
        it("updateListTitle", async () => {
            let result = await mdl.updateListTitle({id: 'er', nameTitle: 'Test', sum: {actual: 12, planned: 23}});
            assert.equal(result.status, 200)
        })
    })
})


