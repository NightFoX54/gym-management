import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSun, FaMoon, FaHeart, FaQuoteRight, FaEdit, FaTrash, FaReply, FaUserPlus } from 'react-icons/fa';
import '../../styles/ForumThread.css';
import { toast } from 'react-hot-toast';

const ForumThread = ({ isDarkMode, setIsDarkMode }) => {
    const navigate = useNavigate();
    const { threadId } = useParams();
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [newPost, setNewPost] = useState({ content: '' });
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [quotedPost, setQuotedPost] = useState(null);
    const [showEditThreadModal, setShowEditThreadModal] = useState(false);
    const [editThreadData, setEditThreadData] = useState({ title: '', description: '' });
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

        fetchThreadDetails();
        fetchPosts();
    }, [setIsDarkMode, threadId, currentPage]);

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

    const fetchThreadDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads/${threadId}`);
            if (!response.ok) {
                throw new Error('Thread not found');
            }
            const data = await response.json();
            setThread(data);
            setEditThreadData({ title: data.title, description: data.description });
        } catch (error) {
            console.error('Error fetching thread details:', error);
            navigate('/member/forum');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads/${threadId}/posts?page=${currentPage}&size=15&currentUserId=${userInfo.id}`);
            const data = await response.json();
            setPosts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads/${threadId}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userInfo.id,
                    content: newPost.content,
                    ...(quotedPost ? { quotedPostId: quotedPost.id } : {})
                })
            });

            if (response.ok) {
                setNewPost({ content: '' });
                setQuotedPost(null);
                setShowReplyModal(false);
                fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleEditPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${editingPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userInfo.id,
                    content: editingPost.content
                })
            });

            if (response.ok) {
                setShowEditModal(false);
                setEditingPost(null);
                fetchPosts();
            }
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}?userId=${userInfo.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/toggle-like?userId=${userInfo.id}`, {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(posts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likesCount: data.likesCount,
                            isLikedByCurrentUser: data.liked
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
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

    const handleEditThread = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads/${threadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userInfo.id,
                    title: editThreadData.title,
                    description: editThreadData.description
                })
            });

            if (response.ok) {
                const updatedThread = await response.json();
                setThread(updatedThread);
                setShowEditThreadModal(false);
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error('Error updating thread:', error);
            alert('Failed to update thread');
        }
    };

    const handleDeleteThread = async () => {
        if (!window.confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/forum/threads/${threadId}?userId=${userInfo.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                navigate('/member/forum');
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error('Error deleting thread:', error);
            alert('Failed to delete thread');
        }
    };

    const handleAddFriend = (userId, userName) => {
        toast.success(`Friend request sent to ${userName}!`);
    };

    if (isLoading) {
        return <div className="loading-forum">Loading...</div>;
    }

    return (
        <div className={`forum-thread-container-forum container-animate ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="thread-header-forum">
                <button className="back-button-trainingplan" onClick={() => navigate('/member/forum')}>
                    <FaArrowLeft />
                    <span>Back to Forum</span>
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

            {thread && (
                <div className="thread-details-forum">
                    <div className="thread-title-section">
                        <div className="thread-header-content">
                            <h1>{thread.title}</h1>
                            {thread.userId === userInfo.id && (
                                <div className="thread-actions">
                                    <button 
                                        className="edit-thread-button" 
                                        onClick={() => setShowEditThreadModal(true)}
                                    >
                                        <FaEdit /> Edit Thread
                                    </button>
                                    <button 
                                        className="delete-thread-button"
                                        onClick={handleDeleteThread}
                                    >
                                        <FaTrash /> Delete Thread
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="thread-meta-forum">
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
                                            onClick={() => handleAddFriend(thread.userId, thread.userName)}
                                            onMouseEnter={() => setShowAddFriendTooltip(`thread-${thread.userId}`)}
                                            onMouseLeave={() => setShowAddFriendTooltip(null)}
                                        >
                                            <FaUserPlus />
                                            {showAddFriendTooltip === `thread-${thread.userId}` && (
                                                <span className="tooltip">Add Friend</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <span className="thread-date-forum">{formatDate(thread.createdAt)}</span>
                        </div>
                        <p className="thread-description-forum">{thread.description}</p>
                    </div>
                </div>
            )}

            <div className="posts-section-forum">
                <div className="posts-header-forum">
                    <h2>Responses</h2>
                    <button 
                        className="reply-button-forum"
                        onClick={() => {
                            setQuotedPost(null);
                            setShowReplyModal(true);
                        }}
                    >
                        <FaReply /> Reply to Thread
                    </button>
                </div>

                <div className="posts-list-forum">
                    {posts.map(post => (
                        <div key={post.id} className="post-card-forum">
                            <div className="post-header-forum">
                                <div className="post-author-forum">
                                    <img 
                                        src={post.userProfilePhoto || '/default-avatar.jpg'} 
                                        alt={post.userName}
                                        className="author-avatar-forum"
                                    />
                                    <div className="author-info-forum">
                                        <span className="author-name-forum">{post.userName}</span>
                                        {post.userId !== userInfo.id && (
                                            <button 
                                                className="add-friend-button-forum"
                                                onClick={() => handleAddFriend(post.userId, post.userName)}
                                                onMouseEnter={() => setShowAddFriendTooltip(`post-${post.id}`)}
                                                onMouseLeave={() => setShowAddFriendTooltip(null)}
                                            >
                                                <FaUserPlus />
                                                {showAddFriendTooltip === `post-${post.id}` && (
                                                    <span className="tooltip">Add Friend</span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <span className="post-date-forum">{formatDate(post.createdAt)}</span>
                            </div>

                            {post.quotedPostId && (
                                <div className="quoted-content-forum">
                                    <FaQuoteRight className="quote-icon-forum" />
                                    <div className="quote-details-forum">
                                        <span className="quoted-author-forum">{post.quotedUserName} wrote:</span>
                                        <p>{post.quotedContent}</p>
                                    </div>
                                </div>
                            )}

                            <p className="post-content-forum">{post.content}</p>

                            <div className="post-actions-forum">
                                <button 
                                    className={`like-button-forum ${post.isLikedByCurrentUser ? 'liked' : ''}`}
                                    onClick={() => handleToggleLike(post.id)}
                                >
                                    <FaHeart />
                                    <span>{post.likesCount}</span>
                                </button>

                                <button 
                                    className="quote-button-forum"
                                    onClick={() => {
                                        setQuotedPost(post);
                                        setShowReplyModal(true);
                                    }}
                                >
                                    <FaQuoteRight />
                                    <span>Quote</span>
                                </button>

                                {post.canEdit && (
                                    <button 
                                        className="edit-button-forum"
                                        onClick={() => {
                                            setEditingPost(post);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <FaEdit />
                                        <span>Edit</span>
                                    </button>
                                )}

                                {post.canDelete && (
                                    <button 
                                        className="delete-button-forum"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        <FaTrash />
                                        <span>Delete</span>
                                    </button>
                                )}
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

            {showReplyModal && (
                <div className="modal-overlay-forum">
                    <div className="modal-content-forum">
                        <h2>{quotedPost ? 'Reply with Quote' : 'Reply to Thread'}</h2>
                        
                        {quotedPost && (
                            <div className="quoted-preview-forum">
                                <div className="quote-header-forum">
                                    <FaQuoteRight />
                                    <span>{quotedPost.userName} wrote:</span>
                                </div>
                                <p>{quotedPost.content}</p>
                            </div>
                        )}

                        <textarea
                            placeholder="Write your reply..."
                            value={newPost.content}
                            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                        />

                        <div className="modal-actions-forum">
                            <button 
                                className="cancel-button-forum"
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setQuotedPost(null);
                                    setNewPost({ content: '' });
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="post-button-forum"
                                onClick={handleCreatePost}
                                disabled={!newPost.content.trim()}
                            >
                                Post Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editingPost && (
                <div className="modal-overlay-forum">
                    <div className="modal-content-forum">
                        <h2>Edit Post</h2>
                        <textarea
                            value={editingPost.content}
                            onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                        />
                        <div className="modal-actions-forum">
                            <button 
                                className="cancel-button-forum"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingPost(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="save-button-forum"
                                onClick={handleEditPost}
                                disabled={!editingPost.content.trim()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditThreadModal && (
                <div className="modal-overlay-forum">
                    <div className="modal-content-forum">
                        <h2>Edit Thread</h2>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={editThreadData.title}
                                onChange={(e) => setEditThreadData({
                                    ...editThreadData,
                                    title: e.target.value
                                })}
                                placeholder="Thread title"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={editThreadData.description}
                                onChange={(e) => setEditThreadData({
                                    ...editThreadData,
                                    description: e.target.value
                                })}
                                placeholder="Thread description"
                                rows="4"
                            />
                        </div>
                        <div className="modal-actions-forum">
                            <button 
                                className="cancel-button-forum"
                                onClick={() => setShowEditThreadModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="save-button-forum"
                                onClick={handleEditThread}
                                disabled={!editThreadData.title.trim() || !editThreadData.description.trim()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumThread; 