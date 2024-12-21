const Bookmark: React.FC<{src:string}> = ({src}) => {
    return (
        <div className="absolute top-4 right-4">
          <img
            src={src}
            alt="Bookmark"
            className="w-4 h-4"
          />
        </div>
    )
}

export default Bookmark