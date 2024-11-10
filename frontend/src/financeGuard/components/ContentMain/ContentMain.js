import "./ContentMain.css";
import Cards from "../Cards/Cards";
import Transactions from "../Transactions/Transactions";
import Report from "../Report/Report";
import Budget from "../Budget/Budget";
import Savings from "../Savings/Savings";
import Loans from "../Loans/Loans";
import Financial from "../Financial/Financial";
import Stat from "../StatisticsChart/StatisticsChart";
import Pie from "../Incomebytype/Incomebytype";
import IncomeBySource from '../IncomeBySource/IncomeBySource';
import Goal from '../Goals/Goals';
import GoalProgress from '../GoalProgress/GoalProgress';
import Headerincome from "../../layout/Header";
const ContentMain = () => {
  return (
    <div className="main-content-holder">
       <Headerincome />
        <IncomeBySource />
        
        <Stat />
   
        <div className="content-grid-one">
            <Cards />
            <Transactions />
            <Report />
        </div>
        <div className="content-grid-two">
            <Budget />
            <div className="grid-two-item">
              <div className="subgrid-two">
                <Goal />
                <Savings />
              </div>
            </div>

            <div className="grid-two-item">
              <div className="subgrid-two">
                <Loans />
                <Financial />
              </div>
            </div>


            <div className="grid-two-item">
              <div className="subgrid-two">
              <GoalProgress />
              </div>
            </div>

            <div className="grid-two-item">
              <div className="subgrid-two">
              <Pie />
            
              </div>
            </div>
           
        </div>
    
    
    </div>
  );
};

export default ContentMain;
