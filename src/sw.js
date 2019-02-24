importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js');

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function(event) {
    event.waitUntil(
        self.clients.matchAll().then(function(clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus();
            } else {
                return self.clients.openWindow('/');
            }
        })
    );
    event.notification.close();
});

self.addEventListener('push', function(event) {
    if (!event.data) {
        return;
    }
    let data = event.data.json();
    if (data.type == 0 && !data.muted) {
        const title = data.sender.nickName;
        const message = data.content;
        const aesKey = data.aesKey;
        
        event.waitUntil(self.registration.showNotification(title, {
            body: CryptoJS.AES.decrypt(message, aesKey).toString(CryptoJS.enc.Utf8),
            icon: 'https://oss.aiursoft.com/download/fromkey/' + data.sender.headImgFileKey,
            tag: data.conversationId.toString()
        }));
    }
});