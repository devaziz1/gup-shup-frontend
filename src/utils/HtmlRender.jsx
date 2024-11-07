
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

const HtmlRender = ({ htmlContent }) => {
  const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />;
};


HtmlRender.propTypes = {
  htmlContent: PropTypes.string.isRequired,
};

export default HtmlRender;
