import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectPageProps {
  title: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ title }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      <p>Details about {title} go here.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default ProjectPage;
