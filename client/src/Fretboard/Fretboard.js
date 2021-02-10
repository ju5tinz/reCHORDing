import React, {Component} from 'react';
import { connect } from 'react-redux'
import {Chord} from '@tonaljs/tonal';

import { addNewChord } from '../features/chords/chordsSlice'


function arrayEqual(a, b) {
  return (a[0] === b[0] && a[1] === b[1])
}

class FretboardFig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currSelected: null,
      currSelectedString: null,
      selectedFrets: [],
      openStrings: [],  //1:"x" 2:"o" 3:" "
      topFret: 1,
      prevTopFret: null,
      currNotes: [],
      chordName: "",
      userDefinedName: false,
    }

    for(let i = 0; i < this.props.numStrings; i++) {
      this.state.openStrings.push(1);
    }

    if(this.props.initialState) {
      this.state = {...this.state, ...this.props.initialState}
    }
    
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseClickFret = this.onMouseClickFret.bind(this);
    this.onMouseClickOpen = this.onMouseClickOpen.bind(this);
    this.onAddChordClick = this.onAddChordClick.bind(this);

    const {width, height, numStrings, numFrets} = this.props;

    this.stringOffset = 0.07 * width;
    this.topOffset = 0.01 * height;
    this.botOffset = 0.01 * height;
    this.stringLoc = this.getLocations(width, this.stringOffset, this.stringOffset, numStrings);
    this.fretLoc = this.getLocations(height, this.topOffset, this.botOffset, numFrets);
    this.numFretsSpaces = parseInt(numFrets - 1);
    this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.openNoteIndex = [4, 9, 2, 7, 11, 4]; //open notes index in noteNames

    this.boundingBoxIndex = [];
    // i, j: string, fret index locations
    for (let i = 0; i < this.stringLoc.length; i++) {
      for (let j = 0; j < this.fretLoc.length - 1; j++) {
        this.boundingBoxIndex.push([i,j]);
      }
    }
    this.boxHeight = this.fretLoc[1] - this.fretLoc[0];
  }

  reset() {
    this.setState({
      currSelected: null,
      currSelectedString: null,
      selectedFrets: [],
      openStrings: [],  //1:"x" 2:"o" 3:" "
      topFret: 1,
      prevTopFret: null,
      currNotes: [],
      chordName: "",
      userDefinedName: false,
    })

    let openStrings = [];
    for(let i = 0; i < this.props.numStrings; i++) {
      openStrings.push(1);
    }
    this.setState({openStrings})
  }

  getLocations(total, offset1, offset2, numItems) {
    const dist = (total - (offset1 + offset2)) / (numItems-1);

    const locs = [];
    for(let loc = offset1; loc < total; loc += dist) {
      locs.push(loc);
    }

    return locs;
  }

  mouseMoveHandler(fretIndex) {
    if(this.state.topFret) {
      const newFretIndex = fretIndex.slice();
      newFretIndex[1] = newFretIndex[1] + this.state.topFret - 1;
      this.setState({currSelected: newFretIndex});
      this.setState({currSelectedString: fretIndex[0]});
    }
  }

  onMouseOut() {
    this.setState({currSelected: null});
    this.setState({currSelectedString: null});
  }

  onMouseClickFret() {
    const selectedFrets = this.state.selectedFrets;
    let currSelected = this.state.currSelected;
    let openStrings = this.state.openStrings;

    if(!currSelected || !this.state.topFret) return;

    let removed = false;

    for(let i = 0; i < selectedFrets.length; i++) {
      if(selectedFrets[i][0] === currSelected[0] && !arrayEqual(selectedFrets[i], currSelected)) {
        selectedFrets.splice(i, 1);
      }
      if(selectedFrets[i] && arrayEqual(selectedFrets[i], currSelected)) {
        selectedFrets.splice(i, 1);
        removed = true;
      }
    }

    if(!removed) {
      selectedFrets.push(currSelected);
      openStrings[currSelected[0]] = 3;
    } else {
      openStrings[currSelected[0]] = 1;
    }

    this.setState({selectedFrets});
    this.setState({openStrings});
    this.updateChord();
  }

  onMouseClickOpen(string) {
    const openStrings = this.state.openStrings;
    const stringState = openStrings[string];
    if(stringState === 1) {
      openStrings[string] = 2;
    }
    else if(stringState === 2) {
      openStrings[string] = 1;
    }
    this.setState({openStrings});
    this.updateChord();
  }

  getFretNums() {
    const topFret = parseInt(this.state.topFret);
    let fretNums = [];

    const width = this.props.width;
    const style = {
      marginLeft: '1em',
      marginRight: '0em',
      fontSize: 0.005*width+0.2 + 'em',
      width: 0.15 * width
    };

    if(!topFret) {
      fretNums.push(<input 
        key={0}
        className='fretNum' 
        type='number' 
        value=' '
        onChange={(event) => this.handleFretNumsChange(event)}
        style={{...style}}
      />)
      for(let i = 1; i < this.numFretsSpaces; i++) {
        fretNums.push(<div 
          key={i} 
          className='fretNum' 
          style={{...style}}>
            &nbsp;
        </div>)
      }

      return fretNums;
    }
    
    fretNums.push(<input 
      key={0}
      type='number' 
      className='fretNum' 
      value={topFret} 
      onChange={(event) => this.handleFretNumsChange(event)}
      style={{...style}}
    />)
    for(let fretNum = topFret + 1; fretNum < topFret + this.numFretsSpaces; fretNum++) {
      fretNums.push(<div 
        key={fretNums} 
        className='fretNum' 
        style={{...style}}>
          {fretNum}
      </div>)
    }
    
    return fretNums;
  }

  handleFretNumsChange(event) {
    if(!event.target.value) {
      this.setState({prevTopFret: this.state.topFret});
      this.setState({topFret: null});
      return;
    }

    const newTopFret = parseInt(event.target.value);
    if(newTopFret > 0 && newTopFret < 51) {
      // setstate before calling function
      this.setState({topFret: newTopFret}, function() {this.removeSelectedNotInView()});
    }
  }

  onAddChordClick() {
    const { selectedFrets, openStrings, topFret, currNotes, chordName } = this.state;
    this.props.addChord({ selectedFrets, openStrings, topFret, currNotes, chordName });
    this.reset();
  }

  removeSelectedNotInView() {
    const topFret = parseInt(this.state.topFret);
    const botFret = topFret + parseInt(this.props.numFrets) - 3;
    const selectedFrets = this.state.selectedFrets;
    const openStrings = this.state.openStrings;

    for(let i = 0; i < selectedFrets.length; i++) {
      if(selectedFrets[i][1] < topFret - 1 || selectedFrets[i][1] > botFret) {
        openStrings[selectedFrets[i][0]] = 1;
        selectedFrets.splice(i, 1);
        i--;
      }
    }

    this.setState({selectedFrets});
    this.updateChord();
  }

  //Get current notes and update chord name
  updateChord() {
    const selectedFrets = this.state.selectedFrets;
    const openStrings = this.state.openStrings;

    const currNotes = [];

    for(let i = 0; i < this.props.numStrings; i++) {
      const stringState = parseInt(openStrings[i]);
      if(stringState === 2) {
        currNotes.push(this.noteNames[this.openNoteIndex[i]]);
      }
      else if(stringState === 3) {
        for(const selected of selectedFrets) {
          if(selected[0] === i) {
            const note = (this.openNoteIndex[selected[0]] + selected[1] + 1) % 12;
            currNotes.push(this.noteNames[note]);
          }
        }
      }
    }

    this.setState({currNotes}, () => { 
      const chordName = this.getChord() 
      if(!this.state.userDefinedName) {
        if(chordName)
          this.setState({chordName});
        else
          this.setState({chordName:''});
      }
    });
  }

  getChord() {
    const chords = Chord.detect(this.state.currNotes);
    /*
    let chordString = '';

    for(const chord of chords) {
      chordString = chordString + chord + ' '; 
    }

    return chordString;
    */
    return chords[0]
  }

  isSelected(index) {
    let inSelectedFrets = false;
    const selectedFrets = this.state.selectedFrets;
    let topFret = this.state.topFret;

    if(!topFret) topFret = this.state.prevTopFret;

    for(const selected of selectedFrets) {
      if(selected[0] === index[0] && (selected[1] - topFret + 1) === index[1])
        inSelectedFrets = true;
    }

    return [inSelectedFrets, 
      this.state.currSelected && this.state.currSelected[0]===index[0] && 
      this.state.currSelected[1]-topFret+1===index[1]]
  }

  render() {
    const {width, height} = this.props;

    return(
      <div className="fretboard-input">
        {/*<div>
          Notes: {this.state.currNotes.map( note => note)}
        </div>*/}
        <div className="name-input-container">
          <input 
            type="text" 
            value={this.state.chordName}
            onChange={(e)=>{this.setState({chordName: e.target.value, userDefinedName: true})}}
          />
        </div>

        <div className='fretboardfig' onMouseOut={this.onMouseOut}>
          <div className='stringNums' style={{margin: -0.0125 * height + 'px 0 ' + 0.075 * height + 'px'}}>
            {this.getFretNums()}
          </div>
          <div className='fretboardgrid'>
            <div className='open-strings' style={{marginLeft: -0.02*width + 'px'}}>
              <OpenStrings 
                xLoc={this.stringLoc} 
                scale={width} 
                currSelectedString={this.state.currSelectedString}
                openStrings={this.state.openStrings}
                onMouseClick={this.onMouseClickOpen}
              />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} pointerEvents='none'>
              {this.stringLoc.map(loc => 
                <line 
                  x1={loc} 
                  y1={this.topOffset} 
                  x2={loc} 
                  y2={height-this.botOffset} 
                  stroke='black' 
                  key={loc.toString()}
                />
              )}
              {this.fretLoc.map(loc =>
                <line 
                  x1={this.stringOffset} 
                  y1={loc} 
                  x2={width-this.stringOffset} 
                  y2={loc} 
                  stroke='black' 
                  key={loc.toString()}
                />
              )}
              {this.boundingBoxIndex.map(index => {
                const [isSelected, isCurr] = this.isSelected(index);
                return <BoundBox 
                  xloc={this.stringLoc[index[0]]-this.stringOffset} 
                  yloc={this.fretLoc[index[1]]} 
                  width={2*this.stringOffset} 
                  height={this.boxHeight} 
                  selected={isSelected} 
                  curr={isCurr}
                  onMouseMove={() => this.mouseMoveHandler(index)}
                  key={index.toString()}
                  pointerEvents='all'
                  onMouseClick={this.onMouseClickFret}
                />
              })}
            </svg>
          </div>
        </div>
        
        <div className="button-container">
          <button type='button' onClick={this.onAddChordClick}>
            Add Chord
          </button>
          <button type='button' onClick={() => this.reset()}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}

const BoundBox = ({xloc, yloc, width, height, selected, curr, onMouseMove, pointerEvents, onMouseClick}) => {
  let output = [<rect x={xloc} 
                y={yloc} height={height} 
                width={width} 
                visibility='hidden' 
                onMouseMove={onMouseMove} 
                pointerEvents={pointerEvents} 
                key='rect'
                onClick={onMouseClick}/>];
  if(selected) output = [output, <circle cx={xloc+width/2} cy={yloc + height/2} r={width/2} className="circle" key='circ'/>];
  if(curr) output = [output, <circle cx={xloc+width/2} cy={yloc + height/2} r={width/2} className="sel-circle" key='circ'/>];

  return output;
} 

const OpenStrings = ({xLoc, scale, currSelectedString, openStrings, onMouseClick}) => {
  const openStringsFig = xLoc.map((loc, index) => {
    const attribs = {
      style: {
        margin: 0 + 'px ' + 0.027 * scale + 'px',
        width: 0.12 * scale + 'px',
        fontSize: 0.005*scale+0.25 + 'em'
      }, 
      key: loc.toString(),
      className: 'openstringchar',
      onClick: () => onMouseClick(index),
    };

    if(index === currSelectedString || openStrings[index] === 3)
      return (<button {...attribs}>&nbsp;</button>);
    if(openStrings[index] === 1)
      return (<button {...attribs}>x</button>);
    if(openStrings[index] === 2)
      return (<button {...attribs}>o</button>);
    return null;
  })

  return openStringsFig;
}

const mapDispatchToProps = (dispatch) => {
  return {
    addChord: (chord) => dispatch(addNewChord(chord))
  }
}

export default connect(null, mapDispatchToProps)(FretboardFig)