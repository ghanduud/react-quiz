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

import { useQuiz } from './context/QuizContext';

export default function App() {
	const { status } = useQuiz();

	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen />}
				{status === 'active' && (
					<>
						<Prograss />
						<Question />

						<Footer>
							<Timer />
							<NextButton />
						</Footer>
					</>
				)}
				{status === 'finished' && <Finished />}
			</Main>
		</div>
	);
}
