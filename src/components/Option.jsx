import { useQuiz } from '../context/QuizContext';

function Option() {
	const { question, dispatch, answer } = useQuiz();
	const hasAnswer = answer !== null;

	return (
		<div className='options'>
			{question.options.map((option, i) => (
				<button
					key={option}
					className={`btn btn-option ${i === answer ? 'answer ' : ''} ${
						hasAnswer ? (i === question.correctOption ? 'correct ' : 'wrong ') : ''
					}`}
					disabled={hasAnswer}
					onClick={() => dispatch({ type: 'newAnswer', payload: i })}>
					{option}
				</button>
			))}
		</div>
	);
}

export default Option;
