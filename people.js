$(function () {
    var objPeople = {
        people: [{
            name: 'Jack',
            age: 18,
            gender: 0,
            books: [{
                title: 'Think in C#',
                keywordsVisible: true,
                keywordsIndicator: '←',
                keywords: ['programming', 'debugging', 'web development', 'object oriented'],
                price: 42.99,
                bClass: 'gray'
            }, {
                title: 'Think in Java',
                keywordsVisible: true,
                keywordsIndicator: '←',
                bClass: 'gray',
                price: 25.99
            }, {
                title: 'Never Think in PHP',
                keywordsVisible: false,
                keywordsIndicator: '→',
                keywords: ['very hard web development script', 'really really hard web development script'],
                bClass: 'gray',
                price: 59.99
            }]
        }, {
            name: 'Rose',
            age: 21,
            gender: 1,
            books: [{
                title: 'Gone with the Wind',
                keywordsVisible: true,
                keywordsIndicator: '←',
                keywords: ['love', 'war', 'growing up'],
                bClass: 'gray',
                price: 32.99
            }, {
                title: 'Pride and Prejudice',
                keywordsVisible: true,
                keywordsIndicator: '←',
                keywords: ['manners'],
                bClass: 'gray',
                price: 28.99
            }]
        }],
        count: 2
    };

    $.cBindSet(objPeople);
});
