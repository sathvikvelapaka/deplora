"""
ML Training Pipeline Source Module.

This module exports all pipeline step functions for easy importing.
"""

from pipelines.shared.exceptions import (
    DataLoadError,
    DataValidationError,
    EmptyDataError,
    FeatureEngineeringError,
    InsufficientDataError,
    InvalidThresholdError,
    InvalidURLError,
    MissingColumnError,
    MLflowTimeoutError,
    ModelRegistrationError,
    ModelTrainingError,
    NetworkError,
    PipelineError,
)
from pipelines.shared.logging_utils import (
    generate_correlation_id,
    get_correlation_id,
    get_logger,
    log_step_complete,
    log_step_error,
    log_step_start,
    set_correlation_id,
)
from pipelines.shared.mlflow_utils import MLFLOW_CONNECTION_TIMEOUT, run_with_timeout
from pipelines.training.src.build_serving_model import build_serving_model
from pipelines.training.src.feature_engineering import feature_engineering
from pipelines.training.src.load_data import load_data
from pipelines.training.src.register_model import register_model
from pipelines.training.src.schema import IrisSchema
from pipelines.training.src.train_model import train_model
from pipelines.training.src.validate_data import validate_data
from pipelines.training.src.validate_model import validate_model

__all__ = [
    # Functions
    "load_data",
    "validate_data",
    "feature_engineering",
    "train_model",
    "validate_model",
    "register_model",
    "build_serving_model",
    # Schema
    "IrisSchema",
    # MLflow utilities
    "run_with_timeout",
    "MLFLOW_CONNECTION_TIMEOUT",
    # Logging utilities
    "get_logger",
    "get_correlation_id",
    "set_correlation_id",
    "generate_correlation_id",
    "log_step_start",
    "log_step_complete",
    "log_step_error",
    # Exceptions
    "PipelineError",
    "DataLoadError",
    "DataValidationError",
    "FeatureEngineeringError",
    "ModelTrainingError",
    "ModelRegistrationError",
    "InsufficientDataError",
    "MissingColumnError",
    "InvalidURLError",
    "NetworkError",
    "EmptyDataError",
    "InvalidThresholdError",
    "MLflowTimeoutError",
]
