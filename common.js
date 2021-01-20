'esversion: 6';

var common = {
        randomValue: function (array) {
                return array[Math.floor(Math.random() * array.length)];
        },
        loopAction: function (time, callback) {
                setTimeout(() => {
                        callback();
                        this.loopAction(time, callback);
                }, time);
        }
}

export default class Common {
        static randomValue (array) {
                return array[Math.floor(Math.random() * array.length)];
        }

        static loopAction (time, callback) {
                setTimeout(() => {
                        callback();
                        this.loopAction(time, callback);
                }, time);
        }
}