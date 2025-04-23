import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatDots, HeartFill, Heart } from 'react-bootstrap-icons';

const PostCard = ({
  id,
  author,
  avatar,
  title,
  content,
  date,
  replies,
  likes,
  isLiked,
  onLike,
  tags = [],
  isFeatured = false
}) => {
  const handleLike = (e) => {
    e.preventDefault();
    onLike(id);
  };

  return (
    <div
      className={`card border rounded-4 shadow-sm transition-all position-relative ${
        isFeatured ? 'border-primary' : 'border-light'
      }`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <span className="position-absolute top-0 end-0 m-2 badge bg-primary-subtle text-primary fw-semibold">
          Featured
        </span>
      )}

      <div className="card-body">
        {/* Author + Date */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fs-6 fw-semibold overflow-hidden" style={{ width: '40px', height: '40px' }}>
            {avatar ? (
              <img
                src={avatar}
                alt={author}
                className="w-100 h-100 object-fit-cover rounded-circle"
              />
            ) : (
              <span>{author?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="small">
            <div className="fw-semibold text-dark">{author}</div>
            <div className="text-muted text-truncate small">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Title + Content Preview */}
        <Link to={`/community/posts/${id}`} className="text-decoration-none">
          <h5 className="card-title text-dark mb-1">{title}</h5>
          <p className="card-text text-muted small mb-2 text-truncate" style={{ WebkitLineClamp: 3 }}>
            {content}
          </p>
        </Link>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="badge text-secondary bg-light fw-normal">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-3 text-secondary small">
          <div className="d-flex align-items-center gap-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`btn btn-sm p-0 border-0 d-flex align-items-center gap-1 ${
                isLiked ? 'text-danger' : 'text-muted'
              }`}
              style={{ background: 'none' }}
            >
              {isLiked ? <HeartFill size={18} /> : <Heart size={18} />}
              <span>{likes}</span>
            </button>

            {/* Replies */}
            <Link
              to={`/community/posts/${id}`}
              className="d-flex align-items-center gap-1 text-muted text-decoration-none hover-text-primary"
            >
              <ChatDots size={18} />
              <span>{replies}</span>
            </Link>
          </div>

          {/* Read more */}
          <Link
            to={`/community/posts/${id}`}
            className="text-primary text-decoration-none fw-medium"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

PostCard.defaultProps = {
  tags: [],
  isFeatured: false,
  isLiked: false,
  onLike: () => {},
};

export default PostCard;
