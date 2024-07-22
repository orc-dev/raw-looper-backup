const DirectedAction = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click: DirectedAction ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>DirectedAction</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default DirectedAction;