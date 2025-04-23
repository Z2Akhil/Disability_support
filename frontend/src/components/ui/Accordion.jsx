import { useState } from 'react';
import PropTypes from 'prop-types';

const Accordion = ({ items = [], multiple = false, defaultOpen = [], className = '' }) => {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const toggleItem = (id) => {
    if (multiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`accordion ${className}`} id="customAccordion">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className="accordion-item border rounded mb-2 overflow-hidden shadow-sm">
            <h2 className="accordion-header" id={`heading-${item.id}`}>
              <button
                className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`collapse-${item.id}`}
              >
                {item.title}
              </button>
            </h2>
            <div
              id={`collapse-${item.id}`}
              className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
              aria-labelledby={`heading-${item.id}`}
            >
              <div className="accordion-body">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired
    })
  ),
  multiple: PropTypes.bool,
  defaultOpen: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  className: PropTypes.string
};

Accordion.defaultProps = {
  items: [],
  multiple: false,
  defaultOpen: [],
  className: ''
};

export default Accordion;
