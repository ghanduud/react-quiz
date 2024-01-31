import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Prograss from './components/Prograss';
import Finished from './components/Finished';
import Footer from './components/Footer';
import Timer from './components/Timer';

const SECS_PER_QUESTION = 30;

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

export default function App() {
	const [{ questions, status, index, answer, points, secondsRemaining }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const questionNum = questions.length;
	const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

	useEffect(function () {
		fetch('http://localhost:8000/questions')
			.then((res) => res.json())
			.then((data) => dispatch({ type: 'dataRecived', payload: data }))
			.catch(() => dispatch({ type: 'dataFailed' }));
	}, []);

	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen questionNum={questionNum} dispatch={dispatch} />}
				{status === 'active' && (
					<>
						<Prograss
							index={index}
							questionNum={questionNum}
							points={points}
							answer={answer}
							totalPoints={totalPoints}
						/>
						<Question question={questions[index]} dispatch={dispatch} answer={answer} />

						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton dispatch={dispatch} answer={answer} index={index} questionNum={questionNum} />
						</Footer>
					</>
				)}
				{status === 'finished' && <Finished points={points} totalPoints={totalPoints} dispatch={dispatch} />}
			</Main>
		</div>
	);
}
