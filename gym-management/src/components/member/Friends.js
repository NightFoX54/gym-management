import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSun, FaMoon, FaUserPlus, FaUserMinus, FaCheck, FaTimes, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import '../../styles/Friends.css';
import withChatAndNotifications from './withChatAndNotifications';

const Friends = ({ isDarkMode, setIsDarkMode }) => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(null);

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        fetchAllData(true);
    }, [setIsDarkMode]);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    const fetchAllData = async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }
            await Promise.all([
                fetchFriends(),
                fetchFriendRequests(),
                fetchOutgoingRequests()
            ]);
            setLastRefreshTime(new Date());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchAllData(true);

        // Set up auto-refresh interval
        const refreshInterval = setInterval(() => fetchAllData(false), 10000); // 10 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/list/${userInfo.id}`);
            if (response.ok) {
                const data = await response.json();
                setFriends(data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
            toast.error('Failed to load friends list');
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/requests/${userInfo.id}`);
            if (response.ok) {
                const data = await response.json();
                setFriendRequests(data);
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            toast.error('Failed to load friend requests');
        }
    };

    const fetchOutgoingRequests = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/requests/sent/${userInfo.id}`);
            if (response.ok) {
                const data = await response.json();
                setOutgoingRequests(data);
            }
        } catch (error) {
            console.error('Error fetching outgoing friend requests:', error);
            toast.error('Failed to load outgoing friend requests');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/friends/search?query=${searchQuery}&currentUserId=${userInfo.id}`);
            if (response.ok) {
                const data = await response.json();
                // Filter out non-MEMBER users and ensure we have valid data
                const memberUsers = data.filter(user => 
                    user && 
                    user.role && 
                    user.role.toUpperCase() === 'MEMBER' &&
                    user.id !== userInfo.id // Exclude current user
                );
                setSearchResults(memberUsers);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Add debounced search handler
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await fetch('http://localhost:8080/api/friends/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    senderId: userInfo.id,
                    receiverId: receiverId
                })
            });

            if (response.ok) {
                toast.success('Friend request sent successfully!');
                // Refresh all relevant data
                await Promise.all([
                    fetchFriends(),
                    fetchFriendRequests(),
                    fetchOutgoingRequests(),
                    handleSearch() // Refresh search results
                ]);
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            toast.error('Failed to send friend request');
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/request/${requestId}/accept?receiverId=${userInfo.id}`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Friend request accepted!');
                fetchFriendRequests();
                fetchFriends();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            toast.error('Failed to accept friend request');
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/request/${requestId}/reject?receiverId=${userInfo.id}`, {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Friend request rejected');
                fetchFriendRequests();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            toast.error('Failed to reject friend request');
        }
    };

    const removeFriend = async (friendId) => {
        if (!window.confirm('Are you sure you want to remove this friend?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/friends/${userInfo.id}/remove/${friendId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Friend removed successfully');
                fetchFriends();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error removing friend:', error);
            toast.error('Failed to remove friend');
        }
    };

    const cancelFriendRequest = async (receiverId) => {
        try {
            const response = await fetch('http://localhost:8080/api/friends/request/cancel', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    senderId: userInfo.id,
                    receiverId: receiverId
                })
            });

            if (response.ok) {
                toast.success('Friend request cancelled');
                fetchOutgoingRequests();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error cancelling friend request:', error);
            toast.error('Failed to cancel friend request');
        }
    };

    return (
        <div className={`friends-container-friendship container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="friends-header-friendship">
                <button className="back-button-trainingplan" onClick={() => navigate('/member')}>
                    <FaArrowLeft />
                    <span>Back to Dashboard</span>
                </button>

                <div className="header-actions">
                    <button 
                        className={`refresh-button-forum ${isRefreshing ? 'loading' : ''}`}
                        onClick={() => fetchAllData(false)}
                        title="Refresh data"
                        disabled={isRefreshing}
                    >
                        <FaSyncAlt />
                        {lastRefreshTime && (
                            <span className="last-refresh">
                                Last updated: {lastRefreshTime.toLocaleTimeString()}
                            </span>
                        )}
                    </button>

                    <button 
                        className={`dark-mode-toggle-friendship ${isDarkMode ? 'active' : ''}`} 
                        onClick={toggleDarkMode}
                    >
                        <FaSun className="toggle-icon-friendship sun-friendship" />
                        <div className="toggle-circle-friendship"></div>
                        <FaMoon className="toggle-icon-friendship moon-friendship" />
                    </button>
                </div>
            </div>

            <div className="friends-content-friendship">
                <div className="friends-section-friendship">
                    <div className="section-header-friendship">
                        <h2>My Friends</h2>
                        <button 
                            className="add-friend-button-friendship"
                            onClick={() => setShowSearchModal(true)}
                        >
                            <FaUserPlus /> Add Friend
                        </button>
                    </div>

                    <div className="friends-grid-friendship">
                        {friends.map(friend => (
                            <div key={friend.id} className="friend-card-friendship">
                                <img 
                                    src={friend.profilePhotoPath || '/default-avatar.jpg'} 
                                    alt={`${friend.firstName} ${friend.lastName}`}
                                    className="friend-avatar-friendship"
                                />
                                <div className="friend-info-friendship">
                                    <h3>{friend.firstName} {friend.lastName}</h3>
                                    <p>{friend.email}</p>
                                </div>
                                <button 
                                    className="remove-friend-button-friendship"
                                    onClick={() => removeFriend(friend.id)}
                                >
                                    <FaUserMinus />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {friendRequests.length > 0 && (
                    <div className="friend-requests-section-friendship">
                        <h2>Friend Requests</h2>
                        <div className="requests-grid-friendship">
                            {friendRequests.map(request => (
                                <div key={request.id} className="request-card-friendship">
                                    <img 
                                        src={request.senderPhoto || '/default-avatar.jpg'} 
                                        alt={request.senderName}
                                        className="request-avatar-friendship"
                                    />
                                    <div className="request-info-friendship">
                                        <h3>{request.senderName}</h3>
                                        <p>Sent a friend request</p>
                                    </div>
                                    <div className="request-actions-friendship">
                                        <button 
                                            className="accept-button-friendship"
                                            onClick={() => acceptFriendRequest(request.id)}
                                        >
                                            <FaCheck />
                                        </button>
                                        <button 
                                            className="reject-button-friendship"
                                            onClick={() => rejectFriendRequest(request.id)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {outgoingRequests.length > 0 && (
                    <div className="friend-requests-section-friendship">
                        <h2>Outgoing Friend Requests</h2>
                        <div className="requests-grid-friendship">
                            {outgoingRequests.map(request => (
                                <div key={request.id} className="request-card-friendship">
                                    <img 
                                        src={request.profilePhotoPath || '/default-avatar.jpg'} 
                                        alt={request.firstName}
                                        className="request-avatar-friendship"
                                    />
                                    <div className="request-info-friendship">
                                        <h3>{request.firstName} {request.lastName}</h3>
                                        <p>Request sent</p>
                                    </div>
                                    <div className="request-actions-friendship">
                                        <button 
                                            className="reject-button-friendship"
                                            onClick={() => cancelFriendRequest(request.userId)}
                                            title="Cancel Request"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showSearchModal && (
                <div className="modal-overlay-friendship">
                    <div className="modal-content-friendship">
                        <h2>Find Friends</h2>
                        <div className="search-box-friendship">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button onClick={handleSearch} disabled={isLoading}>
                                <FaSearch />
                            </button>
                        </div>

                        <div className="search-results-friendship">
                            {isLoading ? (
                                <div className="loading-message">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div key={user.id} className="search-result-item-friendship">
                                        <img 
                                            src={user.profilePhotoPath || '/default-avatar.jpg'} 
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="result-avatar-friendship"
                                        />
                                        <div className="result-info-friendship">
                                            <h3>{user.firstName} {user.lastName}</h3>
                                            <p>{user.email}</p>
                                        </div>
                                        {!user.areFriends && !user.hasRequest && (
                                            <button 
                                                className="send-request-button-friendship"
                                                onClick={() => sendFriendRequest(user.id)}
                                            >
                                                <FaUserPlus />
                                                Add Friend
                                            </button>
                                        )}
                                        {user.areFriends && (
                                            <span className="already-friends-badge-friendship">
                                                Already Friends
                                            </span>
                                        )}
                                        {!user.areFriends && user.hasRequest && (
                                            <span className="request-sent-badge-friendship">
                                                Request Sent
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : searchQuery ? (
                                <div className="no-results-message">No members found</div>
                            ) : null}
                        </div>

                        <div className="modal-actions-friendship">
                            <button 
                                className="close-button-friendship"
                                onClick={() => {
                                    setShowSearchModal(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withChatAndNotifications(Friends); 