/*
 * Copyright (c) 2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.bht.swp.lao.ocp.bayeux;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.java.annotation.ServerAnnotationProcessor;
import org.cometd.server.BayeuxServerImpl;
import org.springframework.beans.factory.config.DestructionAwareBeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

@Component
public class BayeuxInitializer implements DestructionAwareBeanPostProcessor, ServletContextAware {
  private BayeuxServer bayeuxServer;
  private ServerAnnotationProcessor processor;

  @SuppressWarnings("unused")
  @Inject
  private void setBayeuxServer(BayeuxServer bayeuxServer) {
    this.bayeuxServer = bayeuxServer;
  }

  @SuppressWarnings("unused")
  @PostConstruct
  private void init() {
    this.processor = new ServerAnnotationProcessor(bayeuxServer);
  }

  @SuppressWarnings("unused")
  @PreDestroy
  private void destroy() {
  }

  @Override
  public Object postProcessBeforeInitialization(Object bean, String name) {
    processor.processDependencies(bean);
    processor.processConfigurations(bean);
    processor.processCallbacks(bean);
    return bean;
  }

  @Override
  public Object postProcessAfterInitialization(Object bean, String name) {
    return bean;
  }

  @Override
  public void postProcessBeforeDestruction(Object bean, String name) {
    processor.deprocessCallbacks(bean);
  }

  @Bean(initMethod = "start", destroyMethod = "stop")
  public BayeuxServer bayeuxServer() {
    BayeuxServerImpl bean = new BayeuxServerImpl();
    bean.setOption(BayeuxServerImpl.LOG_LEVEL, "3");
    return bean;
  }

  @Override
  public void setServletContext(ServletContext servletContext) {
    servletContext.setAttribute(BayeuxServer.ATTRIBUTE, bayeuxServer);
  }
}
