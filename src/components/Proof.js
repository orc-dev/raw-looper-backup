const Proof = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click: Proof ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>Proof</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default Proof;