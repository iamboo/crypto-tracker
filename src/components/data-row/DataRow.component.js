import React from 'react';
import Icon from 'react-crypto-icons';
import classes from './DataRow.module.css';

const Checkbox = (props) => {
	if(!props.show){
		return null;
	}

	const checkBoxClass = props.tracking ? 'fa-check-square' : 'fa-square-o';
	const unselectedClass = props.tracking ? '' : classes.unselected;
	return (
		<span className={classes.checkbox}>
			<span className={`${'fa fa-lg'} ${checkBoxClass} ${unselectedClass}`}></span>
		</span>
	)
}

export default class DataRowComponent extends React.Component{

	constructor(props) {
		super(props);
		this.rowClick = this.rowClick.bind(this);		
	}

	rowClick(){
		if(this.props.click !== null && this.props.coin && this.props.coin.base){
			this.props.click(this.props.coin.base);
		}
	}

	render(){
		const coin = this.props.coin;
		const listItemClass = this.props.click ? classes['list-item'] : '';
		const selectedClass = this.props.tracking ? classes['selected'] : '';
		return (
			<div className={`${selectedClass} ${listItemClass} ${'list-group-item d-flex flex-row align-items-center'}`} onClick={this.rowClick}>
				<Checkbox tracking={this.props.tracking} show={this.props.click}/>
				<Icon name={coin.base.toLowerCase()} size={40} />
				<span className={`${classes['name-container']} ${'flex-grow-1'}`}>
					<b>{coin.base}</b>
					<small className={classes['coin-name']}>{coin.name}</small>
				</span>
				{new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 2,
					maximumFractionDigits: 4
				}).format(coin.amount)}
			</div>
		)
	}
}