'esversion: 6';

export default class Common {
        
        static RandomValue(array) {
                return array[Math.floor(Math.random() * array.length)];
        }

        static LoopAction(time, callback) {
                setTimeout(() => {
                        callback();
                        this.LoopAction(time, callback);
                }, time);
        }

        /**
         * 
         * @param {Array} arr 
         * @param {Number} size 
         */
        static ResizeArray (arr, size) {
                if (size < 2)
                        return arr;

                while (arr.length > size)
                        arr.shift();

                return arr;
        }
}