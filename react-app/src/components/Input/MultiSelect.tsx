import { Select, SelectProps, selectClasses } from '@mui/base';
import OptionUnstyled, { optionClasses } from '@mui/base/Option';
import PopperUnstyled from '@mui/base/Popper';
import { styled } from '@mui/material';
import React from 'react';

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};



export const MultiSelectOption = styled(OptionUnstyled)(
  ({ theme }) => {
    return `
  list-style: none;
    padding: 8px;
  cursor: default;
  &:hover {
    cursor: pointer; 
  }
  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: rgba(25, 118, 210, 0.12);
    
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `;
  },
);




export interface MultiSelectProps extends SelectProps<string, any> {
  id: string
}


export class MultiSelect extends React.Component<MultiSelectProps, {}> {

  private ref: React.RefObject<HTMLButtonElement> = React.createRef()

  private slots: SelectProps<string, any>['slots'] = {
    root: styled('button')(
      ({ theme }) => `
          font-family: ${theme.typography};
          font-size: 1rem;
          box-sizing: border-box;
          min-height: 1.4375em;
          min-width: 60vh;
          
          height: auto;
          background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
          border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
          border-radius: 0.75em;
          margin: 0.5em;
          padding: 16.5px;
          text-align: left;
          line-height: 1.5;
          color: currentColor;

          &:hover {
            cursor: pointer; 
            border-color: black;
          }
        
    
          &.${selectClasses.focusVisible} {
            outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
          }
        
          &.${selectClasses.expanded} {
            
            &::after {
              margin-left: 1em;
              content: '▴';
            }
          }
        
          &::after {
            margin-left: 1em;
            content: '▾';
            float: right;
          }
          `,
    ),
    listbox: styled('ul')(
      ({ theme }) => `
          font-family: ${theme.typography}
          font-size: 1rem;
          box-sizing: border-box;
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 0px;
          padding-right: 0px;
          margin: 0px;
          background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
          border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
          border-radius: 0.75em;
          box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
          width: ${this.ref.current!.offsetWidth + "px"};
          overflow: auto;
          outline: 0px;
          
          `,
    ),
    popper: styled(PopperUnstyled)(
      ({ }) => `

      z-index: 10;
    
      
      animation: fadeIn 0.2s;
      -webkit-animation: fadeIn 0.2s;
      -moz-animation: fadeIn 0.2s;
      -o-animation: fadeIn 0.2s;
      -ms-animation: fadeIn 0.2s;

      @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      
      @-moz-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      
      @-webkit-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      
      @-o-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      
      @-ms-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      `,),
    ...this.props.slots
  };

  constructor(props: MultiSelectProps) {
    super(props)

    this.state = {
      selected: this.props.value
    }

  }
  render(): JSX.Element {
    return (
      <Select multiple {...this.props} ref={this.ref} slots={this.slots} />
    );
  }
}

