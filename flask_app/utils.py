
import psutil
import logging
import contextlib
import time
import colorlog

# Configure colorlog
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    '%(log_color)s%(asctime)s - %(levelname)s - %(message)s',
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    }
))

logger = colorlog.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)


@contextlib.contextmanager
def track_memory_usage(operation):
    process = psutil.Process()
    before_memory = process.memory_info().rss / 1024 / 1024  # Convert to MB
    start_time = time.time()
    yield
    after_memory = process.memory_info().rss / 1024 / 1024  # Convert to MB
    end_time = time.time()
    memory_diff = after_memory - before_memory
    time_diff = end_time - start_time
    logging.info(f"{operation} memory usage: {memory_diff:.2f} MB in {time_diff:.2f} seconds")
