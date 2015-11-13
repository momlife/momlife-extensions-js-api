PREGIEAPI.load('device', 'utils').module('api', function(api) {

    /**
     * Интерфейс, который реализует публичный API
     * @constructor
     */
    var INTERFACE = function(){

    };

    /**
     * MOCK реализация interface с native приложения
     * @return {INTERFACE}
     */

    INTERFACE.prototype.deviceInterface = function(){ return this; };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.getCurrentUserId = function(){ throw new Error("MOCK INTERFACE - getCurrentUserId()"); };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.showToast = function(){ throw new Error("MOCK INTERFACE - showToast()"); };

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.getAuthToken = function(){ return 'test-token'; };

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.uploadImage = function(options){
		/**
		 * Для теста, потом удалить
		 */
        options = JSON.parse(options);

		var progress = 0;
		var s_id = setInterval(function(){
			window[options.progress]({status: 200, progress: ++progress});

			if(progress == 10){
				clearInterval(s_id);

				window[options.done]({status: 200, url: 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'});
			}
		}, 1000);

		/**
		 * Для теста, потом удалить
		 */
	};


    /**
     * Глобальный API для всех приложений
     * @alias PREGIEAPI.API
     * @type {Function}
     * @namespace PREGIEAPI.API
     * @namespace PREGIEAPI.api
     * @constructor
     */
    var API = function(){
        /**
         * Реализация interface с native приложения
         */
        this.deviceInterface = function(){
            return api.device.os.android() ? window.Android : (api.device.os.ios() ? window.iOS : new INTERFACE().deviceInterface());
        };
    };

    /**
     * Наследование
     * @type {INTERFACE}
     */
    API.prototype = Object.create(INTERFACE.prototype);
    API.prototype.constructor = API;


    /**
     * Получить id текущего пользователя
     * @return {*}
     */
    API.prototype.getCurrentUserId = function(){
        return this.deviceInterface().getCurrentUserId();
    };

    /**
     * Вывести сообщение в native приложении
     * @param message
     */
    API.prototype.showToast = function(message){
        this.deviceInterface().showToast(message);
    };

	/**
	 * Получить токен авторизация с native приложения
	 * @return {*}
	 */
	API.prototype.getAuthToken  = function(){
		return this.deviceInterface().getAuthToken();
	};

	/**
	 * Загрузка фотографии через native приложение
	 * @param options
	 */
	API.prototype.uploadImage = function(options){
		// вызов нативного приложения выбора файла
		this.deviceInterface().uploadImage(
            JSON.stringify({
			    progress: api.utils.createGlobalCallback(options.progress),
			    done: api.utils.createGlobalCallback(options.done)
		    })
        )
	};


    return this.publicateAPI("API", new API());
});