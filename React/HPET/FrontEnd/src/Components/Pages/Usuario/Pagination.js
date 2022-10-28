import Styles from "./FormLayOut.module.css";

const Pagination = ({pages, setCurrentPage, currentPage}) => {

        return (
                <div className={Styles.divFooter}>
                <button className={currentPage===0 ? Styles.buttonCurrentPageDisable : Styles.buttonCurrentPage } onClick={(e)=> setCurrentPage(0) }>Primeira</button>
                <button className={currentPage===0 ? Styles.buttonCurrentPageDisable : Styles.buttonCurrentPage } onClick={(e)=> currentPage>0?setCurrentPage(currentPage-1):0 }>Anterior</button>
                {Array.from(Array(pages), (item, index) => {
                  return (
                    <>    
                      {currentPage === index ? (
                                                <button
                                                  className={ index===currentPage?Styles.buttonCurrentPage:Styles.buttonPage}
                                                  value={index}
                                                  onClick={(e) => setCurrentPage(Number(e.target.value))}
                                                >
                                                {index + 1}
                                                </button>
                                              ) : ""
                      }
                    </>
                  )
                })}
                <button className={currentPage<pages-1?Styles.buttonCurrentPage:Styles.buttonCurrentPageDisable} onClick={(e)=> currentPage<pages-1?setCurrentPage(currentPage+1):pages }>Próximo</button>
                <button className={Number(currentPage)===Number(pages-1)?Styles.buttonCurrentPageDisable:Styles.buttonCurrentPage} onClick={(e)=> setCurrentPage(pages-1) }>Ultima</button>
              </div>
        )
}

export default Pagination;