const Intro = ({ onClickNext }) => {
    function handleOnClick() {
        console.log(`click from Intro`);
        onClickNext();
    }
    return (
        <div>
            <h1>Intro</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default Intro;