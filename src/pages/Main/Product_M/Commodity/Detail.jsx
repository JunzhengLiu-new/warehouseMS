import React from "react"
import {Link, withRouter} from 'react-router-dom'
import Option_item from "./Option_item"
import Memory_utils from "../../../../utils/Memory_utils"
import { req_category_show,req_commodity_item_detail,req_commodity} from "../../../../api"
class Detail extends React.Component{
    commodity_ref = React.createRef()
    description_ref = React.createRef()
    buying_price_ref = React.createRef()
    selling_price_ref = React.createRef()
    expiration_date_ref = React.createRef()
    category_ref = React.createRef()
    img_ref = React.createRef()
    img_change_ref = React.createRef()
	state={
        commodity:"",
        description:"",
		buying_price:0,
        selling_price:0,
        expiration_date:'1900-01-01',
        category:"",
        img_path:"",
        category_list:[]
    }
    UNSAFE_componentWillMount(){
        this.load_category_data()
    }
    set_commodity_detail = ()=>{
        this.commodity_ref.current.value = this.state.commodity
        this.description_ref.current.value = this.state.description
        this.buying_price_ref.current.value = this.state.buying_price
        this.selling_price_ref.current.value = this.state.selling_price
        this.expiration_date_ref.current.value = this.state.expiration_date
        this.category_ref.current.value = this.state.category
    }
    load_detail_data = async () => {
        const commodity_name = this.props.location.state.commodity_name  
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_commodity_item_detail(user,commodity_name,"")
        const commodity_detail = response.data
        this.setState({
            commodity:commodity_detail.name,
            description:commodity_detail.description,
            buying_price:commodity_detail.buying_price,
            selling_price:commodity_detail.selling_price,
            expiration_date:commodity_detail.expiration_date,
            category:commodity_detail.detail.category,
        })
        if(commodity_detail.detail.img){
            this.setState({
                img_path:`/express-server/${commodity_detail.detail.img}`
            })
        }
        else{
            this.setState({
                img_path:`/express-server/uploads/Noimage_12138.png`
            })
        }
        this.set_commodity_detail()
    }
    load_category_data = async () => {
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_category_show(user)
        if (response.data.resCode === 0){
            var category = response.data.responseData[0].category
            var sub_category = response.data.responseData[0]
            var category_list = []
            for(let c of category){
                if (sub_category[c] !== []){
                    category_list.push(c)
                    for(let sub_c of sub_category[c]){
                        category_list.push(`${c}/${sub_c}`)
                    }
                }
                else{
                    category_list.push(c)
                }     
            }
            this.setState({
                category_list:this.state.category_list.concat(category_list)
            })
            this.load_detail_data()
        }
    }
    change_detail = async (event) => {
        event.preventDefault()
        const commodity_new = this.commodity_ref.current.value
        const description_new = this.description_ref.current.value
        const buying_price_new = this.buying_price_ref.current.value
        const selling_price_new = this.selling_price_ref.current.value
        const expiration_date_new = this.expiration_date_ref.current.value
        const category_new = this.category_ref.current.value
        if(commodity_new === this.state.commodity & description_new === this.state.description && buying_price_new === this.state.buying_price && selling_price_new === this.state.selling_price && expiration_date_new === this.state.expiration_date && category_new === this.state.category && typeof(this.img_change_ref.current.files[0]) === "undefined"){
            return
        }
        else{
            const params = {
                name:commodity_new,
                description:description_new,
                buying_price:buying_price_new,
                selling_price:selling_price_new,
                expiration_date:expiration_date_new,
                category:category_new
            }
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_commodity_item_detail(user,params,"change_detail")
        if(response.data.resCode === 0){
            if(typeof(this.img_change_ref.current.files[0]) !== "undefined"){
                this.change_img()
            }
            alert("Change commodity detail successfully!")
            }    
        }
        // if(this.img_ref.current.files[0]){
        //     this.change_img()
        // }
        
    }
    change_img = () => {
        const formData = new FormData()
        const commodityname = this.state.commodity
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        formData.append("singlefile", this.img_change_ref.current.files[0])
        formData.append('username',user)
        formData.append('commodityname',commodityname)
        const endPoint = "/product/commodity/addupdate/img"
        const xhr = new XMLHttpRequest()
        xhr.open("post", endPoint, true)
        xhr.addEventListener("readystatechange", function(){
            if (xhr.status !== 200) {
                console.log("upload error", xhr.status, xhr.statusText, xhr.response);
              } else if (xhr.readyState === 4) {
                console.log(xhr.responseText.responseText)
              }
        })
        xhr.send(formData,user)
    }
    render(){
        return(
            <div style={{"margin":"auto","height":"580px","width":"96%"}}>
                <div><Link to={`/product/commodity`} style={{"float":"right","fontSize":"20px"}}>back</Link></div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <form>
                    <div className="form-group">
                        <label>Commodity</label>
                        <input ref={this.commodity_ref} id="disabledInput" type="text" className="form-control" disabled/>
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input ref={this.description_ref} type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Buying Price</label>
                        <div className="input-group">
                            <input ref={this.buying_price_ref} type="text" className="form-control"/>
                            <span className="input-group-addon">€</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Selling Price</label>
                        <div className="input-group">
                            <input ref={this.selling_price_ref} type="text" className="form-control"/>
                            <span className="input-group-addon">€</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Dxpiration Date</label>
                        <div className="input-group">
                            <input ref={this.expiration_date_ref} type="text" className="form-control"/>
                            {/* <span className="input-group-addon">€</span> */}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Category</label>
                        <select ref={this.category_ref} className="form-control">
                            {this.state.category_list.map((item,index) => <Option_item  option_item={item} load_category_data={this.load_category_data} key={index}/>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputFile">Picture</label>
                        <input ref={this.img_change_ref} type="file"/>
                        <p className="help-block">Upload product images.</p>
                    </div>
                    <button onClick={this.change_detail} type="submit" className="btn btn-default">Submit</button>
                </form>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <img src= {this.state.img_path} ref={this.img_ref} style={{"height":"400px"}} className="img-thumbnail"/>
                </div>
            </div>
        )
    }
}
export default withRouter(Detail);
