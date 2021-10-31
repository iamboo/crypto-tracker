import React from 'react';
import DataRowComponent from '../data-row/DataRow.component';
import classes from './Tracker.module.css';

const LastDateRefresh = (props) => {
	if(!props.show){
		return null;
	}
	return (
		<div className={`${'d-flex'} ${'flex-row'} ${'align-items-center'} ${'border-top'} ${classes['date-refresh']}`}>
			<button type="button" className={'btn btn-sm btn-secondary text-nowrap'} onClick={props.click}>Update Prices</button>
			<small className={classes['last-refresh']}>
				<span>Last update:</span>
				<span>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(props.lastDate)}</span>
			</small>
		</div>
	)
}

const ListHeader = (props) => {
	if(!props.show){
		return null;
	}
	return (
		<div className={`${classes['list-header']} ${'d-flex'} ${'flex-row'} ${'align-items-center'}`}>
			<span className={`${classes['header-coin']} ${'flex-grow-1'}`}>Coin</span>
			<span className={classes['header-price']}>Price</span>
		</div>
	)
}

const NoTracking = (props) => {
	if(!props.show){
		return null;
	}
	return (
		<div className={classes['tracking-list-empty']}>
			No Cryptos are currently selected for price tracking.<br/>
			<button type="button" className={'btn btn-lg btn-info'} onClick={props.click}>Begin Tracking</button>
		</div>
	)
}

export default class TrackerComponent extends React.Component{

	constructor(props) {
		super(props);

		this.openAddModal = this.openAddModal.bind(this);		
	}

	openAddModal(){
		this.props.openAddModal();
	}

	render(){
		const coins = this.props.allCoins ? this.props.allCoins : [];
		const searchTerm = this.props.searchTerm;
		const listItems = coins.map((coin, index) => {
			const show = searchTerm === '' || coin.base.toLowerCase().includes(searchTerm) || (coin.name && coin.name.toLowerCase().includes(searchTerm));
			if(this.props.tracking.includes(coin.base) && show){
				return (
					<DataRowComponent key={index} coin={coin} />
				)
			}
			return null
		});

		return (
			<div className={`${'container'} ${classes['container']} ${classes['tracker-content']}`}>
				<NoTracking show={this.props.tracking.length === 0 && !this.props.loading} click={this.openAddModal}/>
				<ListHeader show={this.props.tracking.length > 0} />
				<div className={`${'list-group list-group-flush'} ${classes['tracking-list-group']}`}>{listItems}</div>
				<LastDateRefresh show={this.props.tracking.length > 0} lastDate={this.props.lastDate} click={this.props.doRefresh}/>
			</div>
		)
	}
}