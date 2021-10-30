import React from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import Icon from 'react-crypto-icons';
import classes from './AddModal.module.css';
import { CheckSquareFill, GearFill, Square } from 'react-bootstrap-icons';
import FilterComponent from '../filter/Filter.component';

export default class AddModalComponent extends React.Component{

	state = {
		allCoins: [],
		tracking: [],
		showModal: false,
		searchTerm: ''
	}

	constructor(props) {
		super(props);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.filterList = this.filterList.bind(this);		
		this.updateTracking = this.updateTracking.bind(this);		
	}

	handleOpenModal() {
		const storeObj = {showModal: true, searchTerm: '',allCoins:[],tracking:[]};
		if(this.props && this.props.allCoins){
			storeObj.allCoins = this.props.allCoins;
		}
		if(this.props && this.props.tracking){
			storeObj.tracking = this.props.tracking;
		}
		this.setState({
			showModal: true, 
			allCoins: this.props.allCoins,
			tracking: this.props.tracking,
			searchTerm: ''
		});
	};

	handleCloseModal() {
		this.setState({showModal: false});
	};

	filterList(searchTerm){
		this.setState({searchTerm:searchTerm});
	}

	itemClick(coin){
		let trackingCoins = this.state.tracking;
		if(trackingCoins.includes(coin)){
			trackingCoins = trackingCoins.filter(c => c !== coin);
		} else {
			trackingCoins.push(coin);
		}
		this.setState({tracking: trackingCoins});
	}

	updateTracking(){
		this.props.onCoinSelect(this.state.tracking);
		this.handleCloseModal();
	}

	render(){
		const searchTerm = this.state.searchTerm;
		const listItems = this.state.allCoins.map((coin, index) => {
			const tracking = this.state.tracking.includes(coin.base);
			const show = searchTerm === '' || coin.base.toLowerCase().includes(searchTerm) || (coin.name && coin.name.toLowerCase().includes(searchTerm));
			if(show){
				return (
					<ListGroup.Item key={index} 
						className={`${classes['list-item']} ${'d-flex'} ${'flex-row'} ${'align-items-center'} ${crypto.selected ? classes['selected'] : ''}`} 
						onClick={() => this.itemClick(coin.base)}>
						<span className={classes.checkbox}>
							{tracking ?
							<CheckSquareFill size={25} />:<Square size={25} className={classes.unselected}/>}
						</span>
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
			return null;
		});

		return (<>
		  <Button variant="outline-info" size="sm" onClick={this.handleOpenModal} title="Manage tracked coins"><GearFill size={20} /></Button>
      <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
        <Modal.Header>
          <Modal.Title className={'flex-grow-1'}>Select Crypto</Modal.Title>
					<FilterComponent onFilter={this.filterList} />
        </Modal.Header>
        <Modal.Body className={classes['add-modal-body']}>
					<ListGroup variant="flush" className={classes['add-list-group']}>{listItems}</ListGroup>
				</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.updateTracking}>
            Track Selected
          </Button>
        </Modal.Footer>
      </Modal>
			</>
		)
	}
}