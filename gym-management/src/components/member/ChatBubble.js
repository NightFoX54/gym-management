import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaReply, FaCheck, FaSearch, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/ChatBubble.css';

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [replyingTo, setReplyingTo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (userInfo.id) {
            fetchFriends();
            fetchChatList();
            fetchUnreadCount();
            
            // Set up polling for new messages and unread count
            const interval = setInterval(async () => {
                await fetchUnreadCount();
                if (selectedChat) {
                    await fetchMessages(selectedChat.id);
                }
                // Only try to fetch chat list if previous request is completed
                try {
                    await fetchChatList();
                } catch (error) {
                    console.error('Error fetching chat list during interval:', error);
                    // Don't update state if there's an error - keep the previous state
                }
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/friends/list/${userInfo.id}`);
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchChatList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/list/${userInfo.id}`);
            setChatList(response.data);
        } catch (error) {
            console.error('Error fetching chat list:', error);
            // Not updating chatList state to preserve the previous valid state
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/unread-count/${userInfo.id}`);
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchMessages = async (partnerId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/messages`, {
                params: {
                    user1Id: userInfo.id,
                    user2Id: partnerId
                }
            });
            // Sort messages by date (oldest first)
            const sortedMessages = response.data.sort((a, b) => 
                new Date(a.sentAt) - new Date(b.sentAt)
            );
            setMessages(sortedMessages);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(`http://localhost:8080/api/chat/send`, null, {
                params: {
                    senderId: userInfo.id,
                    receiverId: selectedChat.id,
                    message: newMessage,
                    repliedToId: replyingTo?.id
                }
            });

            setMessages([...messages, response.data]);
            setNewMessage('');
            setReplyingTo(null);
            scrollToBottom();
            fetchChatList(); // Refresh chat list to update latest messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFriendSelect = async (friend) => {
        setSelectedChat(friend);
        await fetchMessages(friend.id);
        
        // Mark messages as read
        try {
            await axios.post(`http://localhost:8080/api/chat/mark-read`, null, {
                params: {
                    receiverId: userInfo.id,
                    senderId: friend.id
                }
            });
            await Promise.all([
                fetchUnreadCount(),
                fetchChatList()
            ]);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getUnreadCountForFriend = (friendId) => {
        const chatPartner = chatList.find(chat => chat.senderId === friendId);
        return chatPartner ? chatPartner.unreadCount : 0;
    };

    const getTotalMessagesForFriend = (friendId) => {
        const chatPartner = chatList.find(chat => chat.senderId === friendId);
        if (chatPartner) {
            return `${chatPartner.totalMessages} messages`;
        }
        return 'No messages yet';
    };

    const getLastMessageForFriend = (friendId) => {
        const chatPartner = chatList.find(chat => chat.senderId === friendId);
        return chatPartner ? {
            message: chatPartner.lastMessage,
            time: chatPartner.lastMessageTime
        } : null;
    };

    const filteredFriends = friends.filter(friend => 
        friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-bubble-container">
            {/* Chat Button with Unread Count */}
            <button 
                className={`chat-bubble-button ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaComments />
                {unreadCount > 0 && (
                    <span className="unread-count">{unreadCount}</span>
                )}
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="chat-modal">
                    <div className="chat-header">
                        {selectedChat ? (
                            <>
                                <button className="back-button" onClick={() => setSelectedChat(null)}>
                                    <FaArrowLeft />
                                </button>
                                <h3>{selectedChat.firstName + ' ' + selectedChat.lastName}</h3>
                            </>
                        ) : (
                            <h3>Messages</h3>
                        )}
                        <button className="close-button" onClick={() => {
                            setIsOpen(false);
                            setSelectedChat(null);
                        }}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-content">
                        {!selectedChat ? (
                            // Friends List View
                            <>
                                <div className="search-container">
                                    <div className="search-input-wrapper">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                </div>
                                <div className="friends-list">
                                    {filteredFriends.map((friend) => {
                                        const lastMessage = getLastMessageForFriend(friend.id);
                                        const unreadCount = getUnreadCountForFriend(friend.id);
                                        
                                        return (
                                            <div 
                                                key={friend.id}
                                                className={`friend-list-item ${unreadCount > 0 ? 'unread' : ''}`}
                                                onClick={() => handleFriendSelect(friend)}
                                            >
                                                <img 
                                                    src={friend.profilePhotoPath || '/default-avatar.jpg'} 
                                                    alt={`${friend.firstName} ${friend.lastName}`}
                                                    className="friend-avatar"
                                                />
                                                <div className="friend-preview">
                                                    <div className="friend-preview-header">
                                                        <h4>{friend.firstName} {friend.lastName}</h4>
                                                        {lastMessage && (
                                                            <span className="chat-time">
                                                                {formatTime(lastMessage.time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="last-message">
                                                        {lastMessage ? lastMessage.message : 'No messages yet'}
                                                    </p>
                                                    <p className="total-messages">
                                                        {getTotalMessagesForFriend(friend.id)}
                                                    </p>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <span className="chat-unread-count">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {filteredFriends.length === 0 && (
                                        <div className="no-friends-message">
                                            {searchQuery ? 'No friends found matching your search' : 'No friends yet'}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Chat Messages View
                            <>
                                <div className="messages-container" ref={chatContainerRef}>
                                    {messages.map((message) => (
                                        <div 
                                            key={message.id}
                                            className={`message ${message.senderId === userInfo.id ? 'sent' : 'received'}`}
                                        >
                                            {message.repliedToMessage && (
                                                <div className="replied-message">
                                                    {message.repliedToMessage}
                                                </div>
                                            )}
                                            <div className="message-content">
                                                {message.message}
                                                <span className="message-time">
                                                    {formatTime(message.sentAt)}
                                                    {message.senderId === userInfo.id && (
                                                        <FaCheck className={`read-status ${message.isRead ? 'read' : ''}`} />
                                                    )}
                                                </span>
                                            </div>
                                            <button 
                                                className="reply-button"
                                                onClick={() => setReplyingTo(message)}
                                            >
                                                <FaReply />
                                            </button>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {replyingTo && (
                                    <div className="reply-preview">
                                        <div className="reply-content">
                                            <span>Replying to: {replyingTo.message}</span>
                                            <button className="cancel-reply-button" onClick={() => setReplyingTo(null)}>
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="message-input">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <button 
                                        className="send-button"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBubble; 