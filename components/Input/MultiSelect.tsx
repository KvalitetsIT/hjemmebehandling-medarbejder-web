import MultiSelectUnstyled, {
    MultiSelectUnstyledProps,
} from '@mui/base/MultiSelectUnstyled';
import { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import { PlanDefinition } from '@kvalitetsit/hjemmebehandling/Models/PlanDefinition';
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

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }


  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `;
    },
);




export interface MultiSelectProps extends MultiSelectUnstyledProps<PlanDefinition> {
    id: string
}


export class MultiSelect extends React.Component<MultiSelectProps, {}> {

    private ref: React.RefObject<HTMLElement> = React.createRef()

    private components: MultiSelectUnstyledProps<PlanDefinition>['components'] = {
        Root: styled('button')(
            ({ theme }) => `
          font-family: ${theme.typography};
          font-size: 1rem;
          box-sizing: border-box;
          min-height: calc(1.5em + 22px);
          min-width: 320px;
          background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
          border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
          border-radius: 0.75em;
          margin: 0.5em;
          padding: 10px;
          text-align: left;
          line-height: 1.5;
          color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        
          &:hover {
            background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
            border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
          }
        
          &.${selectUnstyledClasses.focusVisible} {
            outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
          }
        
          &.${selectUnstyledClasses.expanded} {
            &::after {
              content: '▴';
            }
          }
        
          &::after {
            content: '▾';
            float: right;
          }
          `,
        ),
        Listbox: styled('ul')(
            ({ theme }) => `
          font-family: ${theme.typography}
          font-size: 1rem;
          box-sizing: border-box;
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 0px;
          padding-right: 0px;
          margin: 0px;
          min-width: 320px;
          background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
          border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
          border-radius: 0.75em;
          box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
          width: ${this.ref.current!.offsetWidth + "px"};
          overflow: auto;
          outline: 0px;
          `,
        ),
        Popper: styled(PopperUnstyled)(
            ({}) => `
                z-index: 1;
            `,),
        ...this.props,
    };

    constructor(props: MultiSelectProps) {
        super(props)
    
    }

    
    render(): JSX.Element {
        return (
            <MultiSelectUnstyled {...this.props} ref={this.ref} components={this.components}>
                {this.props.children}
            </MultiSelectUnstyled>
        );

    }
}