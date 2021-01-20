'esversion: 6';

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