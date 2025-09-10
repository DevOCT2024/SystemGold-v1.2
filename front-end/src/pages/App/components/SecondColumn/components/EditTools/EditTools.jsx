import { Select } from "../../../../../../components/select/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faSquare,
  faClone,
  faCircle,
  faBold,
  faT,
  faCertificate,
  faRightLong,
  faCalendarDays,
  faPlus,
  faLocationDot,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { Button } from "../../../../../../components/button/button";

export const EditTools = ({
  setBorderRadius,
  borderRadius,
  handleBorderRadius,
  optionsBorderRadius,
  modalBorderRadius,
  user,
  optionsOutlineSize,
  selectedDateFinal,
  setDateFinal,
  dateFinal,
  selectedDateInitial,
  dateInitial,
  setDateInitial,
  openModalDates,
  modalOfDates,
  isValidate,
  handleValidate,
  circleGradientType,
  alterDirectionGradienta,
  enablePickerEndColor,
  enablePickerStartColor,
  enableColorPickerSolid,
  handleAdressButton,
  alterShapeForGradientType,
  handleGradientColorChange,
  setSolidColor,
  solidColor,
  setIsGradient,
  isGradient,
  setStartColor,
  startColor,
  setEndColor,
  endColor,
  onModalColor,
  modalColor,
  handleShadowShape,
  handleOutlineSize,
  handleOutlineColorChange,
  handleSelectFontSize,
  optionsFontSize,
  addTextBox,
  history,
  handleNext,
  currentHistoryIndex,
  handlePrev,
  isBold,
  toggleBold,
  addShape,
  selectedShape,
  duplicateShape,
  handleColorChange,
  handleSelectFont,
  optionsFont,
}) => {

  return (
    <main className="EditTools">
      <div className="editTools">

        <div className="TextOptions">
          <div className="ButtonsForFonts">
            <Select
              FirstOption={"Selecione uma fonte"}
              title={"Escolha sua fonte"}
              style={{ width: "auto" }}
              options={optionsFont}
              onChange={(e) => handleSelectFont(e.target.value)}
            />

            <div className="FontSizeAndOutline">
              <div className="FontSizeSelect">
                <Select
                  FirstOption={"Selecione um tamanho de fonte"}
                  title={"Tamanho da fonte"}
                  style={{ width: "auto" }}
                  options={optionsFontSize}
                  onChange={(e) => handleSelectFontSize(e.target.value)}
                />
              </div>

              <div className="OutlineSelect">
                <Select
                  id={"outLineSelect"}
                  FirstOption={"Tamanho de contorno"}
                  title={"Escolha o tamanho do seu contorno"}
                  style={{ width: "auto" }}
                  options={optionsOutlineSize}
                  onChange={(e) => handleOutlineSize(e.target.value)}
                  disabled={
                    !selectedShape || selectedShape.attrs.strokeTam == 0
                  }
                />
              </div>
            </div>
          </div>

          <div className="textAlteration">
            <Button
              title={"Criar Caixa de Texto"}
              style={{ width: "30px", height: "30px" }}
              onClick={addTextBox}
            >
              <FontAwesomeIcon icon={faT} />
            </Button>

            <Button
              title={"Negrito"}
              style={{ width: "30px", height: "30px" }}
              onClick={toggleBold}
            >
              <FontAwesomeIcon icon={faBold} />
            </Button>
          </div>




        </div>

        <hr className="divisionEditTools" />

        <div className="addShapesContent">
          <div className="shapesOfEditTools">
            <Button
              title={"Adicione um Retangulo"}
              style={{ width: "auto", backgroundColor: "transparent" }}
              onClick={() => addShape("rectangle")}
            >
              <FontAwesomeIcon
                size="2x"
                style={{ color: "red" }}
                icon={faSquare}
              />
            </Button>

            <Button
              title={"Adicione um Círculo"}
              style={{ width: "auto", backgroundColor: "transparent" }}
              onClick={() => addShape("circle")}
            >
              <FontAwesomeIcon
                size="2x"
                style={{ color: "red" }}
                icon={faCircle}
              />
            </Button>
          </div>

          <div className="shapesOfEditTools">
            <Button
              title={"Adicione um Selo"}
              style={{ width: "auto", backgroundColor: "transparent" }}
              onClick={() => addShape("star")}
            >
              <FontAwesomeIcon
                size="2x"
                style={{ color: "red" }}
                icon={faCertificate}
              />
            </Button>

            <Button
              title={"Adicione uma Seta"}
              style={{ width: "auto", backgroundColor: "transparent" }}
              onClick={() => addShape("path")}
            >
              <FontAwesomeIcon
                size="2x"
                style={{ color: "red" }}
                icon={faRightLong}
              />
            </Button>
          </div>

          {modalBorderRadius && (
            <>
              <div className="rectRadius">
                arredondar bordas
                <Select
                  FirstOption={"Escolha o arredondamento"}
                  value={borderRadius}
                  onChange={(e) => {
                    handleBorderRadius(e.target.value);
                    setBorderRadius(e.target.value);
                  }}
                  options={optionsBorderRadius}
                />
              </div>
            </>
          )}
        </div>

        <hr className="divisionEditTools" />

        <div className="shapeButtons">
          <div className="DuplicateAndCut">
            <Button
              title={"Duplique Algum Elemento"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onClick={duplicateShape}
              disabled={!selectedShape}
            >
              <FontAwesomeIcon icon={faClone} />
            </Button>

            <Button
              disabled={!selectedShape}
              title={"Adicionar Sombra ao Elemento"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onClick={handleShadowShape}
            >
              <FontAwesomeIcon icon={faImages} />
            </Button>
          </div>

          <div className="historyButtons">

            <Button
              disabled={user ? !user.Adress : null}
              onClick={handleAdressButton}
              title={"Adicione o Endereço"}
              className={"addressButton"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            >
              <FontAwesomeIcon icon={faLocationDot} />
            </Button>

            <Button
              title={"Volte 1 Passo"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onClick={handlePrev}
              disabled={currentHistoryIndex === 0}
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
          </div>

          <div className="AdressAndDatePicker">
            <Button
              title={"Escolha Datas de Validade"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onClick={openModalDates}
            >
              <FontAwesomeIcon icon={faCalendarDays} />
            </Button>
            {modalOfDates && (
              <div className="datesInputs">
                <div className="inputsDate">
                  Data inicial
                  <input
                    type="date"
                    value={dateInitial}
                    onChange={(e) => {
                      setDateInitial(e.target.value);
                      selectedDateInitial(e.target.value);
                    }}
                    name=""
                    id=""
                  />
                </div>

                <div className="inputsDate">
                  Data final
                  <input
                    type="date"
                    value={dateFinal}
                    onChange={(e) => {
                      setDateFinal(e.target.value);
                      selectedDateFinal(e.target.value);
                    }}
                    name=""
                    id=""
                  />
                </div>
                <Button
                  style={{
                    width: "50px",
                    height: "30px",
                    padding: "0",
                    borderRadius: "10px",
                  }}
                  onClick={(e) => {
                    handleValidate();
                    openModalDates();
                  }}
                >
                  <p>Ok</p>
                </Button>
              </div>
            )}

            <Button
              title={"Avançar 1 Passo"}
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onClick={handleNext}
              disabled={currentHistoryIndex === history.length - 1}
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </Button>
          </div>
        </div>
      </div>

      {onModalColor && (
        <div className="selectedSolidOrGradient">
          <Button
            style={{
              position: "fixed",
              top: "20px",
              left: "10px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              padding: 0,
            }}
            onClick={modalColor}
          >
            <p>x</p>
          </Button>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              fontFamily: "Viga",
            }}
          >
            Tipo de Preenchimento:
            <select
              disabled={!selectedShape}
              title="Alternar entre cor sólida e gradiente"
              className="custom-select"
              value={isGradient}
              onChange={(e) => {
                setIsGradient(e.target.value === "true");
                alterShapeForGradientType(e.target.value);
              }}
            >
              <option value="false">Cor Sólida</option>
              <option value="true">Gradiente</option>
            </select>
          </label>

          {isGradient ? (
            <>
              <div>
                <label>
                  Cor Inicial:
                  <Button
                    title={"Escolher a cor inicial do seu gradiente"}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: startColor,
                    }}
                    onClick={enablePickerStartColor}
                    disabled={!selectedShape}
                  >
                    <input
                      type="color"
                      value={startColor}
                      style={{ visibility: "hidden" }}
                      className="inputStartColor"
                      onChange={(e) => {
                        setStartColor(e.target.value);
                        handleGradientColorChange(e.target.value, endColor); // Altera o gradiente
                      }}
                    />
                  </Button>
                </label>
                <label>
                  Cor Final:
                  <Button
                    title={"Escolhar a cor final do seu gradiente"}
                    onClick={enablePickerEndColor}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: endColor,
                    }}
                    disabled={!selectedShape}
                  >
                    <input
                      type="color"
                      value={endColor}
                      className="inputEndColor"
                      style={{ visibility: "hidden" }}
                      onChange={(e) => {
                        setEndColor(e.target.value);
                        handleGradientColorChange(startColor, e.target.value); // Altera o gradiente
                      }}
                    />
                  </Button>
                </label>
              </div>

              <div className="directionGradienteColor">
                <div className="upAndDownButtons">
                  <Button
                    title={"Gradiente da direita para a esquerda"}
                    className={"rigthToLeft"}
                    onClick={(e) => alterDirectionGradienta("rigthToLeft")}
                    disabled={!selectedShape}
                  ></Button>

                  <Button
                    title={"Gradienta da esquerda para a direita"}
                    className={"leftToRight"}
                    onClick={(e) => alterDirectionGradienta("leftToRight")}
                    disabled={!selectedShape}
                  ></Button>
                </div>

                <div className="upAndDownButtons">
                  <Button
                    title={"Gradiente da cima para baixo"}
                    className={"upToDown"}
                    onClick={(e) => alterDirectionGradienta("upToDown")}
                    disabled={!selectedShape}
                  ></Button>

                  <Button
                    title={"Gradiente da baixo para cima"}
                    className={"downToUp"}
                    onClick={(e) => alterDirectionGradienta("downToUp")}
                    disabled={!selectedShape}
                  ></Button>
                </div>

                <div className="midAndExtremeButtons">
                  <Button
                    title={"Gradiente do meio até as bordas"}
                    className={"midToExtreme"}
                    onClick={(e) => circleGradientType("midToExtreme")}
                    disabled={!selectedShape}
                  ></Button>

                  <Button
                    title={"Gradiente da borda até o meio"}
                    className={"midToExtreme"}
                    onClick={(e) => circleGradientType("extremesToMid")}
                    disabled={!selectedShape}
                  ></Button>
                </div>
              </div>
            </>
          ) : (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              Sólida
              <Button
                title={"Escolha uma cor sólida"}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: solidColor,
                }}
                onClick={enableColorPickerSolid}
              >
                <input
                  type="color"
                  value={solidColor}
                  className="inputColorSolid"
                  onChange={(e) => {
                    setSolidColor(e.target.value);
                    handleColorChange(e.target.value);
                  }}
                  style={{ visibility: "hidden" }}
                />
              </Button>
            </label>
          )}
        </div>
      )}

      <div className="colorBar">
        <div className="fundo">
          <p>Preenchimento</p>
          <button
            style={{ backgroundColor: "#FFFF" }}
            onClick={(e) => handleColorChange("#FFFF")}
          ></button>{" "}
          {/*Botão cor Branco*/}
          <button
            style={{ backgroundColor: "#000" }}
            onClick={(e) => handleColorChange("#000")}
          ></button>{" "}
          {/*Botão cor Preto*/}
          <button
            style={{ backgroundColor: "#FF0000" }}
            onClick={(e) => handleColorChange("#FF0000")}
          ></button>{" "}
          {/*Botão cor Vermelho*/}
          <button
            style={{ backgroundColor: "#FFFF00" }}
            onClick={(e) => handleColorChange("#FFFF00")}
          ></button>
          {/*Botão cor Amarelo*/}
          <button
            style={{ backgroundColor: "#008000" }}
            onClick={(e) => handleColorChange("#008000")}
          ></button>
          {/*Botão cor Verde*/}
          <button
            style={{ backgroundColor: "#0000ff" }}
            onClick={(e) => handleColorChange("#0000ff")}
          ></button>
          {/*Botão cor Azul*/}
          <Button
            disabled={!selectedShape}
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            onClick={modalColor}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>

        <hr
          style={{ border: "1px solid white" }}
          className="divisionEditTools"
        />

        <div className="contorno">
          <p>Contorno</p>
          <button
            style={{ backgroundColor: "#FFFF" }}
            onClick={(e) => handleOutlineColorChange("#FFFF")}
          ></button>{" "}
          {/*Botão cor Branco*/}
          <button
            style={{ backgroundColor: "#000" }}
            onClick={(e) => handleOutlineColorChange("#000")}
          ></button>{" "}
          {/*Botão cor Preto*/}
          <button
            style={{ backgroundColor: "#FF0000" }}
            onClick={(e) => handleOutlineColorChange("#FF0000")}
          ></button>{" "}
          {/*Botão cor Vermelho*/}
          <button
            style={{ backgroundColor: "#FFFF00" }}
            onClick={(e) => handleOutlineColorChange("#FFFF00")}
          ></button>
          {/*Botão cor Amarelo*/}
          <button
            style={{ backgroundColor: "#008000" }}
            onClick={(e) => handleOutlineColorChange("#008000")}
          ></button>
          {/*Botão cor Verde*/}
          <button
            style={{ backgroundColor: "#0000ff" }}
            onClick={(e) => handleOutlineColorChange("#0000ff")}
          ></button>
          {/*Botão cor Azul*/}
          <input
            type="color"
            onChange={(e) => handleOutlineColorChange(e.target.value)}
          />
        </div>
      </div>
    </main>
  );
};
