import React from 'react';
import classes from './Filter.module.css';

const FilterIcon = (props) => {
	if(props.searchTerm === ''){
		return (
			<span className={`${'fa fa-filter'} ${classes['input-icon']}`}></span>
		)
	}
	return (
		<span className={`${'fa fa-times'} ${classes['input-dirty']} ${classes['input-icon']}`} onClick={props.click}></span>
	)
}

export default class FilterComponent extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			searchTerm: ''
		}

		this.filterList = this.filterList.bind(this);		
	}

	filterList(event){
		const searchTerm = event ? event.target.value.toLowerCase() : '';
		this.setState({searchTerm: searchTerm});
		this.props.onFilter(searchTerm);
	}

	render(){
		return (
			<div className={classes['filter-form-group']}>
				<input type="text" placeholder="Filter" value={this.state.searchTerm} className={'form-control'} onChange={this.filterList} autoComplete="off" />
				<FilterIcon searchTerm={this.state.searchTerm} click={() => this.filterList(null)} />
			</div>
		)
	}
}