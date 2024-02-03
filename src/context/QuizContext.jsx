import { createContext, useContext, useEffect, useReducer } from 'react';

const SECS_PER_QUESTION = 30;

const QuizContext = createContext();

const initialState = {
	questions: [],
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataRecived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION };
		case 'newAnswer':
			const question = state.questions[state.index];
			return {
				...state,
				answer: action.payload,
				points: action.payload === question.correctOption ? state.points + question.points : state.points,
			};
		case 'nextQuestion':
			return { ...state, index: state.index + 1, answer: null };
		case 'finish':
			return { ...state, status: 'finished' };
		case 'restart':
			return { ...initialState, questions: state.questions, status: 'ready' };
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? 'finished' : state.status,
			};
		default:
			throw new Error('Unknown action');
	}
}

function QuizProvider({ children }) {
	const [{ questions, status, index, answer, points, secondsRemaining }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const questionNum = questions.length;
	const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
	const question = questions[index];

	useEffect(
		function () {
			fetch('http://localhost:8000/questions')
				.then((res) => res.json())
				.then((data) => dispatch({ type: 'dataRecived', payload: data }))
				.catch(() => dispatch({ type: 'dataFailed' }));
		},
		[dispatch]
	);

	return (
		<QuizContext.Provider
			value={{
				questionNum,
				status,
				index,
				answer,
				questions,
				points,
				secondsRemaining,
				totalPoints,
				question,
				dispatch,
			}}>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined) throw new Error('Post context user out side post provider');
	return context;
}

export { QuizProvider, useQuiz };
