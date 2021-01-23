import React, {Component} from 'react';
import { connect } from 'react-redux'
import { selectChordById } from '../features/chords/chordsSlice'

class FretboardFig extends Component {
  constructor(props) {
    super(props);
    
    this.state = props.chord

    const {width, height, numStrings, numFrets} = this.props;

    this.stringOffset = 0.07 * width;
    this.topOffset = 0.05 * height;
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

  getLocations(total, offset1, offset2, numItems) {
    const dist = (total - (offset1 + offset2)) / (numItems-1);

    const locs = [];
    for(let loc = offset1; loc < total; loc += dist) {
      locs.push(loc);
    }

    return locs;
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
      <div className='chord-item'>
        <div className='fretboardfig'>
          <div className='stringNums' style={{margin: 0.05 * height + 'px 0 ' + 0.075 * height + 'px'}}>
            {this.getFretNums()}
          </div>
          <div className='fretboardgrid'>
            <div className='open-strings' style={{marginLeft: -0.02*width + 'px'}}>
              <OpenStrings 
                xLoc={this.stringLoc} 
                scale={width} 
                openStrings={this.state.openStrings}
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
                  key={index.toString()}
                />
              })}
            </svg>
          </div>
        </div>

        <div>
          Notes: {this.state.currNotes.map( note => note)}
          Chord: {this.state.chordName}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { chordId } = props
  const chord = selectChordById(state, chordId)

  return {chord}
}

const BoundBox = ({xloc, yloc, width, height, selected, curr}) => {
  let output = [<rect x={xloc} 
                y={yloc} height={height} 
                width={width} 
                visibility='hidden' 
                key='rect'
                />];
  if(selected) output = [output, <circle cx={xloc+width/2} cy={yloc + height/2} r={width/2} className="circle" key='circ'/>];
  if(curr) output = [output, <circle cx={xloc+width/2} cy={yloc + height/2} r={width/2} className="sel-circle" key='circ'/>];

  return output;
} 

const OpenStrings = ({xLoc, scale, openStrings}) => {
  const openStringsFig = xLoc.map((loc, index) => {
    const attribs = {
      style: {
        margin: 0 + 'px ' + 0.027 * scale + 'px',
        width: 0.12 * scale + 'px',
        fontSize: 0.005*scale+0.25 + 'em'
      }, 
      key: loc.toString(),
      className: 'openstringchar',
    };

    if(openStrings[index] === 3)
      return (<button {...attribs}>&nbsp;</button>);
    if(openStrings[index] === 1)
      return (<button {...attribs}>x</button>);
    if(openStrings[index] === 2)
      return (<button {...attribs}>o</button>);
    return null;
  })

  return openStringsFig;
}

export default connect(mapStateToProps)(FretboardFig)