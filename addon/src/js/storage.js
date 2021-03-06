'use strict';

import utils from './utils';
import constants from './constants';

let errorCounter = 0;

export default {
    async get(data) {
        let result = null;

        try {
            result = await browser.storage.local.get(data);

            if (!result) {
                throw Error('managed storage is not set, browser.storage.local.get result = undefined');
            }
        } catch (e) {
            errorCounter++;

            if (errorCounter > 100) {
                console.error(e);
                throw e;
            }

            await utils.wait(200);
            return this.get(data);
        }

        if (null === data) {
            result = {...utils.clone(constants.DEFAULT_OPTIONS), ...result};
        } else if ('string' === utils.type(data)) {
            if (undefined === result[data]) {
                result[data] = utils.clone(constants.DEFAULT_OPTIONS[data]);
            }
        } else if (Array.isArray(data)) {
            data.forEach(key => undefined === result[key] ? result[key] = utils.clone(constants.DEFAULT_OPTIONS[key]) : null);
        }

        return result;
    },
    clear: browser.storage.local.clear,
    remove: browser.storage.local.remove,
    async set(data) {
        if (data.groups) {
            data.groups.forEach(group => group.tabs = []);
        }

        try {
            await browser.storage.local.set(data);
        } catch (e) {
            console.error(e);

            let message = null,
                {os} = await browser.runtime.getPlatformInfo();

            if (e && e.message) {
                message = e.message;
            }

            if (message === 'An unexpected error occurred' && os === 'linux') {
                let existData = await this.get(null);

                let newData = {
                    ...existData,
                    ...data,
                };

                await browser.storage.local.clear();

                await browser.storage.local.set(newData);
            } else {
                throw e;
            }

        }

        // return browser.storage.local.set(data);
    },
}
