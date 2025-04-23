import { useState } from 'react';
import CourseCard from '../components/ui/CourseCard';

const EducationTraining = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Accessible Web Design",
      category: "skill",
      duration: "6 weeks",
      supportLevel: "screen-reader",
      description: "Learn to create websites that are accessible to all users.",
      price: "Free"
    },
    // Add more courses here
  ];

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'skill', name: 'Skill Training' },
    { id: 'degree', name: 'Online Degrees' },
    { id: 'cert', name: 'Certification' }
  ];

  const supportLevels = {
    'screen-reader': 'Screen Reader Ready',
    'sign-language': 'Sign Language Available',
    'captioning': 'Closed Captioning',
    'adaptive': 'Adaptive Learning'
  };

  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter(course => course.category === activeCategory);

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold mb-4 text-center">Education & Training</h1>

      {/* Category Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`btn rounded-pill ${
              activeCategory === category.id ? 'btn-primary' : 'btn-outline-secondary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="row g-4 mb-5">
        {filteredCourses.map(course => (
          <div key={course.id} className="col-md-6 col-lg-4">
            <CourseCard
              title={course.title}
              category={categories.find(c => c.id === course.category)?.name}
              duration={course.duration}
              supportLevel={supportLevels[course.supportLevel]}
              description={course.description}
              price={course.price}
              actionText="Enroll Now"
              onAction={() => console.log(`Enrolling in ${course.title}`)}
            />
          </div>
        ))}
      </div>

      {/* Scholarships Section */}
      <section className="mb-5 p-4 bg-light rounded shadow-sm">
        <h2 className="h4 fw-bold mb-4">Scholarships & Grants</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-3 border rounded bg-white h-100">
              <h5 className="fw-semibold mb-2">National Disability Scholarship</h5>
              <p>Up to $5,000 for students with disabilities pursuing higher education.</p>
              <button className="btn btn-primary">Learn More</button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border rounded bg-white h-100">
              <h5 className="fw-semibold mb-2">Vocational Training Grant</h5>
              <p>Funding for skill development programs for differently-abled individuals.</p>
              <button className="btn btn-primary">Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Section */}
      <section className="p-4 bg-white rounded shadow-sm mb-5">
        <h2 className="h4 fw-bold mb-3">Connect with a Mentor</h2>
        <p className="mb-4">
          Our mentor program connects you with experienced professionals who can guide you in your educational and career journey.
        </p>
        <button className="btn btn-success d-flex align-items-center gap-2">
          <span>Find a Mentor</span>
          <i className="bi bi-person-plus-fill"></i>
        </button>
      </section>
    </div>
  );
};

export default EducationTraining;
