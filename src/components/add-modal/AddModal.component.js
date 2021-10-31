import React from 'react';
import classes from './AddModal.module.css';
import FilterComponent from '../filter/Filter.component';
import DataRowComponent from '../data-row/DataRow.component';

export default class AddModalComponent extends React.Component{

	state = {
		allCoins: [],
		tracking: [],
		showModal: false,
		searchTerm: ''
	}


	// myModal = new bootstrap.Modal(document.getElementById('test-modal'));

	constructor(props) {
		super(props);
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.filterList = this.filterList.bind(this);		
		this.updateTracking = this.updateTracking.bind(this);
		this.modalClick = this.modalClick.bind(this);
		this.modalRef = React.createRef();	
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
		this.modalRef.current.style.display = 'block';
		this.modalRef.current.classList.add(['fade', 'show']); 
	};

	handleCloseModal() {
		this.modalRef.current.style.display = 'none';
		this.modalRef.current.classList.remove(['fade', 'show']); 
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

	modalClick(event){
		if(event.target === this.modalRef.current){
			this.handleCloseModal();
		}
	}

	render(){
		const searchTerm = this.state.searchTerm;
		const listItems = this.state.allCoins.map((coin, index) => {
			const tracking = this.state.tracking.includes(coin.base);
			const show = searchTerm === '' || coin.base.toLowerCase().includes(searchTerm) || (coin.name && coin.name.toLowerCase().includes(searchTerm));
			if(show){
				return (
					<DataRowComponent key={index} coin={coin} click={() => this.itemClick(coin.base)} tracking={tracking} />
				)
			}
			return null;
		});

		return (<>
			<button type="button" className={'btn btn-sm btn-outline-info'} onClick={this.handleOpenModal} title="Manage tracked coins"><span className={'fa fa-cog fa-lg'}></span></button>
			<div className="modal" tabIndex="-1" ref={this.modalRef} role="dialog" aria-hidden="true" onClick={this.modalClick}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className={'modal-header'}>
							<h5 className={'modal-title flex-grow-1'}>Select Crypto</h5>
							<FilterComponent onFilter={this.filterList} />
						</div>
						<div className={`${classes['add-modal-body']} ${'modal-body'}`}>
							<div className={`${'list-group list-group-flush'} ${classes['add-list-group']}`}>{listItems}</div>
						</div>
						<div className={'modal-footer'}>
							<button type="button" className={'btn btn-secondary'} onClick={this.handleCloseModal}>Close</button>
							<button type="button" className={'btn btn-primary'} onClick={this.updateTracking}>Track Selected</button>
						</div>
					</div>
				</div>
			</div>
			</>
		)
	}
}