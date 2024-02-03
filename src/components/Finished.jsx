import { useQuiz } from '../context/QuizContext';

function Finished() {
	const { points, totalPoints, dispatch } = useQuiz();
	const percetage = Math.ceil((points / totalPoints) * 100);

	return (
		<>
			<p className='result'>
				Your scored <strong>{points}</strong> out of {totalPoints} ({percetage}%)
			</p>
			<button className='btn btn-ui' onClick={() => dispatch({ type: 'restart' })}>
				Restart Quiz
			</button>
		</>
	);
}

export default Finished;
