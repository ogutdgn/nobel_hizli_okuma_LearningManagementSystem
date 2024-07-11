import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useEnrollmentCalls from "../hooks/useEnrollmentCalls";

const Enrollments = () => {
  const dispatch = useDispatch();
  const { getEnrollments, removeEnrollment } = useEnrollmentCalls();
  const { enrollments, loading, error, deletingId } = useSelector(state => state.enrollment);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getEnrollments();
  }, [getEnrollments]);

  const handleDelete = async (enrollmentId) => {
    if (!deleting) {
      setDeleting(true);
      try {
        await dispatch(removeEnrollment(enrollmentId));
      } catch (e) {
        console.error(e);
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading enrollments.</p>;

  return (
    <div>
      <h1>Enrollment List</h1>
      <ul>
        {enrollments.map(enrollment => (
          <li key={enrollment._id}>
            {enrollment.studentId.username} - {enrollment.courseId.courseName}
            <button
              onClick={() => handleDelete(enrollment._id)}
              disabled={deletingId === enrollment._id}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Enrollments;
