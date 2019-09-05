const faker = require('faker');
const sinon = require('sinon')


const getTestArray = () => {
    let array = [
        ` test===test`,
        ` (2/4)test===test`,
        `test ===test`,
        `  #test ===#test`,
        `test===test`,
        `test(23/44)===test`,
        `test (23/44) test===test  test`,
    ]
    return array
}

const getAttrCards = () => {
    let actual = faker.random.number(1000);
    let planned = faker.random.number(1000);
    let num = `(${actual}/${planned})`;
    let words = faker.random.words(5);

    return [
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": `${num} ${words}`,
                "day": faker.date.toString()
            },
            "expected": {
                name: `${num} ${words}`,
                estimate: `${num}`,
                estimateValues: [actual, planned],
                actual: actual,
                planned: planned
            }
        },
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": `${words}`,
                "day": faker.date.toString()
            },
            "expected": {
                name: words,
                estimate: null,
                estimateValues: [],
                actual: 0,
                planned: 0
            }
        },
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": ` ${words} `,
                "day": faker.date.toString()
            },
            "expected": {
                name: words,
                estimate: null,
                estimateValues: [],
                actual: 0,
                planned: 0
            }
        }, {
            "actual": {
                "id": faker.random.uuid(),
                "name": ` ${words} 456 ${num} `,
                "day": faker.date.toString()
            },
            "expected": {
                name: `${words} 456 ${num}`,
                estimate: null,
                estimateValues: [],
                actual: 0,
                planned: 0
            }
        },
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": ` (${actual}/) 456 ${num} `,
                "day": faker.date.toString()
            },
            "expected": {
                name: `(${actual}/) 456 ${num}`,
                estimate: null,
                estimateValues: [],
                actual: 0,
                planned: 0
            }
        },
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": ` ${num} ${words} `,
                "day": faker.date.toString()
            },
            "expected": {
                name: `${num} ${words}`,
                estimate: num,
                estimateValues: [actual, planned],
                actual: actual,
                planned: planned
            }
        },
        {
            "actual": {
                "id": faker.random.uuid(),
                "name": ` ${num} `,
                "day": faker.date.toString()
            },
            "expected": {
                name: `${num}`,
                estimate: num,
                estimateValues: [actual, planned],
                actual: actual,
                planned: planned
            }
        },

    ]
}
const arrayEstimateReplace = () => {
    let array = [];
    let index = 0;
    while (index < 5) {
        let actual = faker.random.number(100);
        let planned = faker.random.number(100);
        let el = {
            "actual": `(${actual}/${planned})`,
            "expected": [`${actual}`, `${planned}`]
        };
        array.push(el);
        index++;
    }

    return array;
}

const boardLists = [
    {
        id: '5be8a25291362e779e781f5c',
        name: 'ToDo',
        closed: false,
        idBoard: '5be8a2396b9863490fb7ba0d',
        pos: 65535,
        subscribed: false,
        softLimit: null
    },
    {
        id: '5be8a25494e7d80d7c87c63a',
        name: 'Doing',
        closed: false,
        idBoard: '5be8a2396b9863490fb7ba0d',
        pos: 131071,
        subscribed: false,
        softLimit: null
    },
    {
        id: '5be8a2571bb2833e3556dfcb',
        name: '(16/16) (16/16) (16/16)',
        closed: false,
        idBoard: '5be8a2396b9863490fb7ba0d',
        pos: 196607,
        subscribed: false,
        softLimit: null
    }]

const listsExpectedBoard = [{id: '5be8a25291362e779e781f5c', name: 'ToDo'},
    {id: '5be8a25494e7d80d7c87c63a', name: 'Doing'},
    {
        id: '5be8a2571bb2833e3556dfcb',
        name: '(16/16) (16/16) (16/16)'
    }]


const cards = [
    {
        id: '5d3c3dff3ffded305a11cebd',
        checkItemStates: null,
        closed: false,
        dateLastActivity: '2019-08-06T15:38:32.543Z',
        name: '(8/8) AWS Pipelines error',
        pos: 65535,
        shortLink: 'SsWv78HZ',
        url: 'https://trello.com/c/SsWv78HZ/46-8-8aws-pipelines-error'
    },
    {
        id: '5d414acac03c342ac4812581',
        checkItemStates: null,
        closed: false,
        dateLastActivity: '2019-08-06T15:34:01.113Z',
        name: '(8/8) how do p3 instance shut down',
        pos: 131071,
        shortLink: 'SqNnAPDe',
        url: 'https://trello.com/c/SqNnAPDe/47-8-8how-do-p3-instance-shut-down'
    }];


const cardsExpectedTest =
    {
        id: '--test--',
        name: '(16/16) Test',
        nameTitle: 'Test',
        sum: {actual: 16, planned: 16}
    }

const boards = [
    {
        name: 'Digs.Cloud',
        dateLastActivity: '2019-09-02T15:56:39.823Z',
        id: '5ccfff23adc6aa5ce666dab9',
        url: 'https://trello.com/b/XRCI6uef/digscloud',
    },
    {
        name: 'Predapp/Prenigma',
        dateLastActivity: '2019-06-04T13:48:14.112Z',
        id: '5c802e16c056ab8c5a289e5a',
        url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma'
    },
    {
        name: 'AKUPCOV',
        dateLastActivity: '2019-06-04T13:48:14.112Z',
        id: '5c802e16c056ab8c5a289e5a',
        url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma'
    }];
const boardsExpectedList = [
    {
        id: '5ccfff23adc6aa5ce666dab9',
        url: 'https://trello.com/b/XRCI6uef/digscloud',
        name: 'Digs.Cloud'
    },
    {
        id: '5c802e16c056ab8c5a289e5a',
        url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma',
        name: 'Predapp/Prenigma'
    },
    {
        id: '5c802e16c056ab8c5a289e5a',
        url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma',
        name: 'AKUPCOV'
    }

];
const runEstimatesListExpected = {
    event: undefined,
    context: undefined,
    result:
        [{
            id: '5ccfff23adc6aa5ce666dab9',
            url: 'https://trello.com/b/XRCI6uef/digscloud',
            name: 'Digs.Cloud',
            results: [Array]
        },
            {
                id: '5c802e16c056ab8c5a289e5a',
                url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma',
                name: 'Predapp/Prenigma',
                results: [Array]
            },
            {
                id: '5c802e16c056ab8c5a289e5a',
                url: 'https://trello.com/b/l7MgNvGF/predapp-prenigma',
                name: 'AKUPCOV',
                results: [Array]
            }]
}


module.exports = {
    getTestArray,
    getAttrCards,
    runEstimatesListExpected,
    listsExpectedBoard,
    cardsExpectedTest,
    boardsExpectedList,
    arrayEstimateReplace,
    boards,
    boardLists,
    cards
}
