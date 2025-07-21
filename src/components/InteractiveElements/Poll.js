import React, { useState } from 'react';
import axios from '../../axiosConfig';
import './Poll.css';

const Poll = ({ pollData, postId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(pollData.options);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;

    try {
      const response = await axios.post(`/api/polls/${pollData._id}/vote`, {
        optionIndex: selectedOption
      });
      setResults(response.data.options);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const calculatePercentage = (votes) => {
    const totalVotes = results.reduce((sum, option) => sum + option.votes, 0);
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="poll-container">
      <h3 className="poll-question">{pollData.question}</h3>
      <div className="poll-options">
        {results.map((option, index) => (
          <div key={index} className="poll-option">
            {!hasVoted ? (
              <label className="option-label">
                <input
                  type="radio"
                  name="poll-option"
                  onChange={() => setSelectedOption(index)}
                  disabled={hasVoted}
                />
                {option.text}
              </label>
            ) : (
              <div className="result-bar">
                <div 
                  className="result-fill"
                  style={{ width: `${calculatePercentage(option.votes)}%` }}
                >
                  {option.text} ({calculatePercentage(option.votes)}%)
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {!hasVoted && (
        <button 
          className="vote-button"
          onClick={handleVote}
          disabled={!selectedOption}
        >
          Vote
        </button>
      )}
    </div>
  );
};

export default Poll;