import React from 'react';
import { Form } from 'react-bootstrap';
import classes from './Filter.module.css';
import { Funnel, XCircleFill } from 'react-bootstrap-icons';

const FilterIcon = (props) => {
	if(props.searchTerm === ''){
		return (
			<Funnel className={classes['input-icon']} size={20} />
		)
	}
	return (
		<XCircleFill className={`${classes['input-icon']} ${classes['input-dirty']}`} size={20} onClick={props.click}/>
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
			<Form.Group controlId="cryptoFilter" className={classes['filter-form-group']}>
				<Form.Control type="text" placeholder="Filter" value={this.state.searchTerm} onChange={this.filterList} autoComplete="off" />
				<FilterIcon searchTerm={this.state.searchTerm} click={() => this.filterList(null)} />
			</Form.Group>
		)
	}
}