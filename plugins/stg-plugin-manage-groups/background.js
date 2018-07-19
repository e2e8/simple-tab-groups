(function() {
    'use strict';

    const STG_ID = 'simple-tab-groups@drive4ik',
        STG_HOME_PAGE = 'https://addons.mozilla.org/firefox/addon/simple-tab-groups/';

    browser.notifications.onClicked.addListener(function() {
        browser.tabs.create({
            url: STG_HOME_PAGE,
        });
    });

    browser.browserAction.onClicked.addListener(function() {
        browser.runtime.sendMessage(STG_ID, {
            action: 'open-manage-groups',
        }, function(responce) {
            if (!responce || !responce.ok) {
                browser.notifications.create({
                    type: 'basic',
                    iconUrl: '/icons/icon.svg',
                    title: browser.i18n.getMessage('extensionName'),
                    message: browser.i18n.getMessage('needInstallSTGExtension'),
                });
            }
        });
    });

})()
