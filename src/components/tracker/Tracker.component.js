import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import Icon from 'react-crypto-icons';
import classes from './Tracker.module.css';

const LastDateRefresh = (props) => {
	if(!props.show){
		return null;
	}
	return (
		<div className={`${'d-flex'} ${'flex-row'} ${'align-items-center'} ${'border-top'} ${classes['date-refresh']}`}>
			<Button variant="secondary" size="sm" className={'text-nowrap'} onClick={props.click}>Update Prices</Button>
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
			<Button variant="info" size="lg" onClick={props.click}>Begin Tracking</Button>
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
					<ListGroup.Item key={index} className={'d-flex flex-row align-items-center'}>
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
					</ListGroup.Item>
				)
			}
			return null
		});

		return (
			<div className={`${'container'} ${classes['container']} ${classes['tracker-content']}`}>
				<NoTracking show={this.props.tracking.length === 0} click={this.openAddModal}/>
				<ListHeader show={this.props.tracking.length > 0} />
				<ListGroup variant="flush" className={classes['tracking-list-group']}>{listItems}</ListGroup>
				<LastDateRefresh show={this.props.tracking.length > 0} lastDate={this.props.lastDate} click={this.props.doRefresh}/>
			</div>
		)
	}
}