import { CONJECTURE_LIST } from "../constants/experimentMeta";
import { useApplicationContext } from "../contexts/ApplicationContext";

const FinalAnswer = ({ onClickNext, currStep }) => {
    const {shuffled_seq} = useApplicationContext();

    function handleOnClick() {
        const cid = shuffled_seq[currStep];
        console.log(`FinalAnswer: ${currStep}, (${cid}-${CONJECTURE_LIST[cid].label})`);
        console.log(`-`);
        onClickNext();
    }
    return (
        <div>
            <h1>FinalAnswer</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default FinalAnswer;