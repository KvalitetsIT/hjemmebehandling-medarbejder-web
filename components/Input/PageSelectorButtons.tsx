import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Pagination } from '@mui/material';

export interface Props {
    currentPageNumber: number
    setPage: (pageNumber: number, data: unknown[]) => void
    getData: (pageNumber: number) => Promise<unknown[]>
}
export interface State {
    hasNextPage: boolean
}


export class PageSelectorButtons extends Component<Props, State> {
    static displayName = PageSelectorButtons.name;
    static contextType = ApiContext

    constructor(props: Props) {
        super(props);
        this.state = {
            hasNextPage: false
        }
    }

    async componentDidMount() : Promise<void> {
        await this.changePage(1)
    }

    render(): JSX.Element {
        return this.renderContent();
    }

    async changePage(pageNumber: number) : Promise<void> {
        const data = await this.props.getData(pageNumber);
        const nextPage = await this.props.getData(pageNumber + 1);
        this.setState({
            hasNextPage: nextPage.some(() => true)
        })
        this.props.setPage(pageNumber, data);

    }

    renderContent(): JSX.Element {
        return (
            <>
                <Pagination
                    count={this.state.hasNextPage ? this.props.currentPageNumber + 1 : this.props.currentPageNumber}
                    page={this.props.currentPageNumber}
                    onChange={async (e, number) => await this.changePage(number)}
                />
            </>
        )
    }



}
