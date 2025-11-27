import { EditTools } from './components/EditTools/EditTools';
import { BoxDecoration } from './components/ExempleAndBox/BoxDecoration';
import { Button } from '../../../../components/button/button';
import './index.css';
import ExempleImage from './ExempleImages/ExempleImage';
// import { StampsProvider } from '../../../../contexts/StampsContext'; // (não usado)
import { StageContent } from './components/Konva/StageContent';
import ShortcutInformations from './components/ShortCutsInformations/ShortcutInformations';


const SecondColumn = ({
  nextStage,
  prevStage,
  stageId,
  addNewStage,
  setStageQuantity,
  stageQuantity,
  handleTransformEndAndSaveToHistory,
  saveToHistory,
  handleTransform,
  groupRef,
  groupActive,
  handleTransformGroup,
  groupRefs,
  selectedElements,
  handleDeselect,
  shapesRefs,
  setBorderRadius,
  borderRadius,
  handleBorderRadius,
  optionsBorderRadius,
  modalBorderRadius,
  adress,
  user,
  blobImg,
  setTexts,
  optionsOutlineSize,
  openModalDates,
  modalOfDates,
  formatedDateFinal,
  selectedDateFinal,
  setDateFinal,
  dateFinal,
  formatedDateInitial,
  selectedDateInitial,
  dateInitial,
  setDateInitial,
  handleValidate,
  isValidate,
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
  inputPosition,
  saveTextChange,
  handleTextChange,
  editingTextIndex,
  tempTextValue,
  enableTextEditing,
  texts,
  addTextBox,
  selectedText,
  handleSelectText,
  textRef,
  imageRef,
  products,
  copies,
  guides,
  transformerRef,
  handleDragEnd,
  handleDragMove,
  handleSelect,
  setShapes,
  shapes,
  handleMouseLeave,
  handleMouseEnter,
  desabilitarBackground,
  backgroundImage,
  setSelectedText,
  setSelectedShape,
  selectedTabloid,

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

  // ✅ ADICIONE ESTAS DUAS PROPS (vindas do Aplication.jsx)
  onClearCurrentPage,
  exportImage,
  registerExporter,
  pendingClickProductId,
  onClickHandled,
  stageSize,
  backgroundUrl,
  bgUrl,
}) => {
  return (
    <main className="secondColumnApp">
      <ShortcutInformations />

      <EditTools
        optionsFont={optionsFont}
        optionsOutlineSize={optionsOutlineSize}
        handleSelectFont={handleSelectFont}
        handleColorChange={handleColorChange}
        duplicateShape={duplicateShape}
        selectedShape={selectedShape}
        addShape={addShape}
        isBold={isBold}
        toggleBold={toggleBold}
        history={history}
        currentHistoryIndex={currentHistoryIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
        addTextBox={addTextBox}
        optionsFontSize={optionsFontSize}
        handleSelectFontSize={handleSelectFontSize}
        handleOutlineColorChange={handleOutlineColorChange}
        handleOutlineSize={handleOutlineSize}
        handleShadowShape={handleShadowShape}
        modalColor={modalColor}
        onModalColor={onModalColor}
        setIsGradient={setIsGradient}
        isGradient={isGradient}
        setSolidColor={setSolidColor}
        solidColor={solidColor}
        setStartColor={setStartColor}
        startColor={startColor}
        endColor={endColor}
        setEndColor={setEndColor}
        handleGradientColorChange={handleGradientColorChange}
        alterShapeForGradientType={alterShapeForGradientType}
        handleAdressButton={handleAdressButton}
        enableColorPickerSolid={enableColorPickerSolid}
        enablePickerStartColor={enablePickerStartColor}
        enablePickerEndColor={enablePickerEndColor}
        alterDirectionGradienta={alterDirectionGradienta}
        circleGradientType={circleGradientType}
        handleValidate={handleValidate}
        isValidate={isValidate}
        openModalDates={openModalDates}
        modalOfDates={modalOfDates}
        setDateInitial={setDateInitial}
        dateInitial={dateInitial}
        selectedDateInitial={selectedDateInitial}
        setDateFinal={setDateFinal}
        dateFinal={dateFinal}
        selectedDateFinal={selectedDateFinal}
        modalBorderRadius={modalBorderRadius}
        optionsBorderRadius={optionsBorderRadius}
        setBorderRadius={setBorderRadius}
        borderRadius={borderRadius}
        handleBorderRadius={handleBorderRadius}
        user={user}
      />

      <StageContent
        stageSize={stageSize}
        bgUrl={bgUrl}
        
        backgroundUrl={backgroundUrl || null}
        onClearCurrentPage={onClearCurrentPage}
        setStageQuantity={setStageQuantity}
        stageQuantity={stageQuantity}
        handleTransformEndAndSaveToHistory={handleTransformEndAndSaveToHistory}
        saveToHistory={saveToHistory}
        groupRefs={groupRefs}
        groupRef={groupRef}
        handleTransformGroup={handleTransformGroup}
        groupActive={groupActive}
        handleTransform={handleTransform}
        selectedElements={selectedElements}
        shapesRefs={shapesRefs}
        handleDeselect={handleDeselect}
        // stageRef={stageRef} // ❌ remova: StageContent gerencia seus próprios refs
        selectedTabloid={selectedTabloid}
        setSelectedShape={setSelectedShape}
        setSelectedText={setSelectedText}
        selectedText={selectedText}
        backgroundImage={backgroundImage}
        desabilitarBackground={desabilitarBackground}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        setShapes={setShapes}
        shapes={shapes}
        handleSelect={handleSelect}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
        selectedShape={selectedShape}
        transformerRef={transformerRef}
        guides={guides}
        copies={copies}
        products={products}
        imageRef={imageRef}
        textRef={textRef}
        isBold={isBold}
        handleSelectText={handleSelectText}
        texts={texts}
        enableTextEditing={enableTextEditing}
        tempTextValue={tempTextValue}
        editingTextIndex={editingTextIndex}
        handleTextChange={handleTextChange}
        saveTextChange={saveTextChange}
        inputPosition={inputPosition}
        isGradient={isGradient}
        solidColor={solidColor}
        startColor={startColor}
        endColor={endColor}
        isValidate={isValidate}
        formatedDateInitial={formatedDateInitial}
        formatedDateFinal={formatedDateFinal}
        setTexts={setTexts}
        user={user}
        adress={adress}
        addNewStage={addNewStage}
        stageId={stageId}
        prevStage={prevStage}
        nextStage={nextStage}

        // PROPS NOVAS: fazem o “auto-clique” funcionar e somem os no-undef
        registerExporter={registerExporter}                // registra o exporter do Stage
        exportImage={exportImage}
        pendingClickProductId={pendingClickProductId}
        onClickHandled={onClickHandled}
      />

      <ExempleImage blobImg={blobImg} />
      <BoxDecoration />

      <Button style={{ width: '40%' }} onClick={exportImage}>
        Exportar/Salvar Arte(s)
      </Button>
    </main>
  );
};

export default SecondColumn;
