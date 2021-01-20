'esversion: 6';

export default class Common {
        static RandomValue (array) {
                return array[Math.floor(Math.random() * array.length)];
        }

        static LoopAction (time, callback) {
                setTimeout(() => {
                        callback();
                        this.LoopAction(time, callback);
                }, time);
        }
}