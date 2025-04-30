import React from 'react';
import ChatBubble from './ChatBubble';
import NotificationBubble from './NotificationBubble';

const withChatAndNotifications = (WrappedComponent) => {
    return function WithChatAndNotificationsComponent(props) {
        return (
            <>
                <WrappedComponent {...props} />
                <ChatBubble />
                <NotificationBubble />
            </>
        );
    };
};

export default withChatAndNotifications; 