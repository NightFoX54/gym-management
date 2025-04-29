import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSun, FaMoon, FaUser, FaHeart, FaComment, FaFire, FaTrophy, FaPlus, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import '../../styles/Forum.css';

const Forum = ({ isDarkMode, setIsDarkMode }) => {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [hotThreads, setHotThreads] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', description: '' });
    const [showAddFriendTooltip, setShowAddFriendTooltip] = useState(null);

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

        fetchThreads();
        fetchHotThreads();
        fetchTopContributors();
    }, [setIsDarkMode, currentPage]);

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

    const fetchThreads = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads?page=${currentPage}&size=10`);
            const data = await response.json();
            setThreads(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

    const fetchHotThreads = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/hot-threads');
            const data = await response.json();
            setHotThreads(data);
        } catch (error) {
            console.error('Error fetching hot threads:', error);
        }
    };

    const fetchTopContributors = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/top-contributors');
            const data = await response.json();
            setTopContributors(data);
        } catch (error) {
            console.error('Error fetching top contributors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateThread = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userInfo.id,
                    title: newThread.title,
                    description: newThread.description
                })
            });

            if (response.ok) {
                setShowNewThreadModal(false);
                setNewThread({ title: '', description: '' });
                fetchThreads();
            }
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Add this function to handle friend requests
    const handleAddFriend = (userId, userName) => {
        // This is a placeholder for now - we'll implement the actual functionality later
        toast.success(`Friend request sent to ${userName}!`);
    };

    return (
        <div className={`forum-container-forum container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="forum-header-forum">
                <button className="back-button-trainingplan" onClick={() => navigate('/member')}>
                    <FaArrowLeft />
                    <span>Back to Dashboard</span>
                </button>

                <button 
                    className={`dark-mode-toggle-forum ${isDarkMode ? 'active' : ''}`} 
                    onClick={toggleDarkMode}
                >
                    <FaSun className="toggle-icon-forum sun-forum" />
                    <div className="toggle-circle-forum"></div>
                    <FaMoon className="toggle-icon-forum moon-forum" />
                </button>
            </div>

            <div className="forum-content-forum">
                <div className="forum-main-forum">
                    <div className="forum-title-section-forum">
                        <h1>Forum Discussions</h1>
                        <button 
                            className="new-thread-button-forum"
                            onClick={() => setShowNewThreadModal(true)}
                        >
                            <FaPlus /> New Thread
                        </button>
                    </div>

                    <div className="threads-list-forum">
                        {threads.map(thread => (
                            <div 
                                key={thread.id} 
                                className="thread-card-forum"
                                onClick={() => navigate(`/member/forum/thread/${thread.id}`)}
                            >
                                <div className="thread-header-forum">
                                    <div className="thread-author-forum">
                                        <img 
                                            src={thread.userProfilePhoto || '/default-avatar.jpg'} 
                                            alt={thread.userName}
                                            className="author-avatar-forum"
                                        />
                                        <div className="author-info-forum">
                                            <span className="author-name-forum">{thread.userName}</span>
                                            {thread.userId !== userInfo.id && (
                                                <button 
                                                    className="add-friend-button-forum"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddFriend(thread.userId, thread.userName);
                                                    }}
                                                    onMouseEnter={() => setShowAddFriendTooltip(`thread-${thread.id}`)}
                                                    onMouseLeave={() => setShowAddFriendTooltip(null)}
                                                >
                                                    <FaUserPlus />
                                                    {showAddFriendTooltip === `thread-${thread.id}` && (
                                                        <span className="tooltip">Add Friend</span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <span className="thread-date-forum">
                                        {formatDate(thread.lastPostAt || thread.createdAt)}
                                    </span>
                                </div>
                                <h3 className="thread-title-forum">{thread.title}</h3>
                                <p className="thread-description-forum">{thread.description}</p>
                                <div className="thread-stats-forum">
                                    <div className="stat-item-forum">
                                        <FaComment />
                                        <span>{thread.totalPosts} posts</span>
                                    </div>
                                    <div className="stat-item-forum">
                                        <FaHeart />
                                        <span>{thread.totalLikes} likes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination-forum">
                        <button 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="forum-sidebar-forum">
                    <div className="sidebar-card-forum hot-threads-forum">
                        <div className="card-header-forum">
                            <FaFire className="card-icon-forum" />
                            <h2>Hot Threads</h2>
                        </div>
                        <div className="card-content-forum">
                            {hotThreads.map(thread => (
                                <div 
                                    key={thread.id} 
                                    className="hot-thread-item-forum"
                                    onClick={() => navigate(`/member/forum/thread/${thread.id}`)}
                                >
                                    <h4>{thread.title}</h4>
                                    <div className="hot-thread-stats-forum">
                                        <span>{thread.totalPosts} posts</span>
                                        <span>{thread.totalLikes} likes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-card-forum top-contributors-forum">
                        <div className="card-header-forum">
                            <FaTrophy className="card-icon-forum" />
                            <h2>Top Contributors</h2>
                        </div>
                        <div className="card-content-forum">
                            {topContributors.map((contributor, index) => (
                                <div key={contributor.userId} className="contributor-item-forum">
                                    <div className="contributor-rank-forum">{index + 1}</div>
                                    <img 
                                        src={contributor.profilePhoto || '/default-avatar.jpg'} 
                                        alt={contributor.userName}
                                        className="contributor-avatar-forum"
                                    />
                                    <div className="contributor-info-forum">
                                        <div className="contributor-name-wrapper">
                                            <span className="contributor-name-forum">{contributor.userName}</span>
                                            {contributor.userId !== userInfo.id && (
                                                <button 
                                                    className="add-friend-button-forum"
                                                    onClick={() => handleAddFriend(contributor.userId, contributor.userName)}
                                                    onMouseEnter={() => setShowAddFriendTooltip(`contributor-${contributor.userId}`)}
                                                    onMouseLeave={() => setShowAddFriendTooltip(null)}
                                                >
                                                    <FaUserPlus />
                                                    {showAddFriendTooltip === `contributor-${contributor.userId}` && (
                                                        <span className="tooltip">Add Friend</span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <span className="contributor-posts-forum">{contributor.postCount} posts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showNewThreadModal && (
                <div className="modal-overlay-forum">
                    <div className="modal-content-forum">
                        <h2>Create New Thread</h2>
                        <input
                            type="text"
                            placeholder="Thread Title"
                            value={newThread.title}
                            onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Thread Description"
                            value={newThread.description}
                            onChange={e => setNewThread({ ...newThread, description: e.target.value })}
                        />
                        <div className="modal-actions-forum">
                            <button 
                                className="cancel-button-forum"
                                onClick={() => setShowNewThreadModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="create-button-forum"
                                onClick={handleCreateThread}
                                disabled={!newThread.title.trim() || !newThread.description.trim()}
                            >
                                Create Thread
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forum; 