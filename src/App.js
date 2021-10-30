import React from 'react';
import './App.css';
import TrackerComponent from './components/tracker/Tracker.component';
import { Spinner } from 'react-bootstrap';
import AddModalComponent from './components/add-modal/AddModal.component';
import { cryptoSymbol } from 'crypto-symbol';
import FilterComponent from './components/filter/Filter.component';
import Icon from 'react-crypto-icons';

const TrackerSearch = (props) => {
	if(props.tracking.length > 10){
		return (
			<FilterComponent onFilter={props.callback} />
		)
	}
	return null;
}

const Loader = (props) => {
	if(props.loading){
		return (
			<div className="loader">
				<Spinner animation="border" role="status" />
				<div className="loading-text">Loading...</div>
			</div>
		)
	}
	return null;
}

class App extends React.Component {

	timer = null;

  constructor(props) {
    super(props);

		this.addModalRef = React.createRef();
    this.showSelected = this.showSelected.bind(this);
    this.filterList = this.filterList.bind(this);
    this.getCoinPrices = this.getCoinPrices.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
		
  }

  state = {
		allCoins: [],
		lastRefreshDate: Date,
		loading: true,
		tracking: [],
		searchTerm: ''
  }

	componentDidMount(){
		this.getCoinPrices(true);
	}

	componentWillUnmount(){
		this.timer = null;
	}

	async getCoinPrices(getStored){
		this.timer = null;
		this.setState({loading: true});
		const { nameLookup } = cryptoSymbol({});
		const url = "https://api.coinbase.com/v2/prices/USD/spot";
		const response = await fetch(url);
		const responseJson = await response.json();
		let storeObj = {};
		if(responseJson.data && responseJson.data.length > 0){
			const now = new Date();
			const coins = responseJson.data;
			if(this.state.allCoins.length > 0){
				this.updatePrices(coins);
			} else {
				const updatedCoins = coins.map(coin => {
					coin.name = nameLookup(coin.base.toUpperCase(), { exact: true });
					coin.showTracking = coin.showTracking === null || coin.showTracking !== false;
					return coin;
				});
				storeObj.allCoins = updatedCoins;
			}
			storeObj.loading = false;
			storeObj.lastRefreshDate = now;
			localStorage.setItem('trackedDate', now);
			this.timer = setTimeout(
				() => this.getCoinPrices(false), 
				(1000 * 60 * 5)
			);
		}
		if(getStored){
			const fromStorage = this.restoreStoredData();
			storeObj = Object.assign({}, storeObj, fromStorage);
		}
		this.setState(storeObj);
	}

	updatePrices(updates){
		this.state.allCoins.forEach(coin => {
			const updatedPrice = updates.find(u => u.base === coin.base);
			coin.amount = updatedPrice.amount;
		});
	}

	restoreStoredData(){
		const trackedFromStorage = localStorage.getItem('tracked');
		const refreshDate = localStorage.getItem('trackedDate');
		let storeObj = {}
		if(trackedFromStorage){
			const trackedBases = JSON.parse(trackedFromStorage);
			storeObj.tracking = trackedBases;
		}
		if(refreshDate){
			storeObj.lastRefreshDate = refreshDate;
		}
		return storeObj;
	}

	showSelected(selectedCoins){
		localStorage.setItem('tracked', JSON.stringify(selectedCoins));
		this.setState({tracking: selectedCoins});
	}

	filterList(searchTerm){
		this.setState({searchTerm: searchTerm});
	}

	openAddModal(){
		if(this.addModalRef && this.addModalRef.current){
			this.addModalRef.current.handleOpenModal();
		}
	}

	render(){
		return (
			<div className="App">
				<header className="App-header">
					<div className={'container d-flex flex-row align-items-center App-header-container'}>
						<Icon name="GENERIC" size={30} />
						<p className="App-title">Tracker</p>
						<TrackerSearch tracking={this.state.tracking} callback={this.filterList} />
						<AddModalComponent ref={this.addModalRef} allCoins={this.state.allCoins} onCoinSelect={this.showSelected} tracking={this.state.tracking} />
					</div>
				</header>
				<Loader loading={this.state.loading} />
				<TrackerComponent 
					allCoins={this.state.allCoins}
					tracking={this.state.tracking}
					lastRefresh={this.state.lastRefreshDate}
					doRefresh={this.getCoinPrices} 
					searchTerm={this.state.searchTerm}
					openAddModal={this.openAddModal}/>
			</div>
		);
	}
}

export default App;
